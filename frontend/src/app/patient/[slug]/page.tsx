"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

type Message = {
  type: "client" | "server";
  message: string;
};

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [code, setCode] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
  }

  useEffect(() => {
    async function getId() {
      try {
        // Get the token from local storage.
        const idToken = "anything";

        // If token is present, then create a websocket connection.
        if (idToken) {
          console.log("idToken:", idToken);
          setToken(idToken);
          console.log("token:", token);

          //  Get the web socket connection URI from the config file.
          const websocket_uri = process.env.NEXT_PUBLIC_BACKEND_SOCKET || "";

          // Create a websocket connection.
          const websocket = new WebSocket(
            `${websocket_uri}/patient/health_metrics/${slug}`
          );

          // Store the websocket connection in a ref.
          websocketRef.current = websocket;

          // Set the onopen, onmessage, onerror and onclose event listeners.
          websocket.onopen = () => {
            console.log("WebSocket connection opened");
            setIsConnected(true);
          };

          // On receiving a message, parse the message and add it to the messages array.
          websocket.onmessage = (event) => {
            try {
              console.log("Received message:", event.data);
              // Parse the message on receiving from the client.
              const receivedMessage = JSON.parse(event.data);

              // Add the message to the messages array.
              setMessages((prevMessages) => [
                ...prevMessages,
                { type: "server", message: receivedMessage },
              ]);
            } catch (error) {
              console.log("Error in onmessage:", error);
            }
          };

          // On error, log the error message.
          websocket.onerror = (error) => {
            console.log("WebSocket error:", error);
          };

          // On closing the connection, log the reason.
          websocket.onclose = (event) => {
            console.log("WebSocket connection closed:", event.reason);
          };
        }
      } catch (error) {
        console.error("Error in getId:", error);
      }
    }
    getId();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    // If websocket connection is present, then send the message.
    if (websocketRef.current) {
      const messageObject = { query: message, password: code };
      websocketRef.current.send(JSON.stringify(messageObject));
      setMessage("");
    }

    // Add the message to the messages array.
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "client", message: message },
    ]);
  };

  return (
    <div className="flex flex-col h-screen items-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white h-full rounded-lg shadow-lg p-6 overflow-hidden">
        <div className="flex justify-center mb-4">
          <h1 className="text-3xl font-bold text-blue-600">{slug}</h1>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-full md:w-2/3 lg:w-1/2">
            <div className="mb-4">
              <label htmlFor="code" className="text-sm text-gray-700">
                Enter your code
              </label>
              <input
                type="text"
                id="code"
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded-lg"
                placeholder="Enter code here"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-gray-50 p-4 rounded-lg overflow-y-auto mb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="/images/bot.jpg"
                alt="Bot"
                className="w-48 h-48 object-contain"
              />
              <h2 className="text-lg text-blue-400 mt-2">
                Hit the send button to start the conversation.
              </h2>
            </div>
          )}

          {messages.map((item, index) => (
            <div key={index}>
              {item.type === "client" && (
                <div className="flex flex-row justify-end mb-2">
                  <div className="rounded-md max-w-4/5 bg-blue-500 text-white p-2 text-end">
                    <Markdown className="text-base">{item.message}</Markdown>
                  </div>
                </div>
              )}

              {item.type !== "client" && (
                <div className="flex flex-row justify-start mb-2">
                  <div className="rounded-md w-4/5 bg-gray-300 text-black p-2">
                    <Markdown className="text-base">{item.message}</Markdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white flex items-center border-t">
          {isConnected ? (
            <div className="flex w-full max-w-4xl mx-auto">
              <input
                className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              >
                Send
              </button>
            </div>
          ) : (
            <div className="flex w-full max-w-4xl mx-auto justify-center">
              <p className="text-gray-500">Connecting...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
