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
          const websocket_uri = process.env.NEXT_PUBLIC_BACKEND_SOCKET || ""

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
      const messageObject = { query: message };
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
    <div className="flex flex-col h-screen  p-4 items-center bg-gray-200">

      <div className="w-1/3 h-full bg-white p-4 rounded-lg">
      <div className="flex justify-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">{slug}</h1>
      </div>

      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-4/5">
          <img
            src={"/images/bot.jpg"}
            alt="Bot"
            className="w-72 h-96 object-contain"
          />
          <h2 className="text-lg text-blue-400 mt-2">
            Hit the send button to start the conversation.
          </h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((item, index) => (
          <div
            key={index.toString() + message}
            className={`p-4 mb-2 rounded-lg max-w-[80%] ${
              item.type === "client"
                ? "bg-pink-400 self-end"
                : "bg-teal-400 self-start"
            }`}
          >
            <Markdown className="text-white text-base">{item.message}</Markdown>
          </div>
        ))}
      </div>

      {isConnected ? (
        <div className="flex items-center ">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-lg mr-2 bg-white text-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-lg bg-teal-400 text-white"
          >
            Send
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-gray-500">Connection Screen</p>
        </div>
      )}
      </div>
    </div>
  );
}
