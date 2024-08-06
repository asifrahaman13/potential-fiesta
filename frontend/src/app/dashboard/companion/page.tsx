'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Message } from '@/app/types/chat_Types';
import MessageState from '@/app/components/MessageState';

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);
  const [userMessage, setUserMessage] = useState<string>('');
  const [messageState, setMessageState] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_SOCKET || '';
    const websocket = new WebSocket(`${backendUrl}/chat/chat/${accessToken}`);
    websocketRef.current = websocket;
    websocket.onopen = () => {
      console.log('Connected to websocket');
    };

    websocket.onmessage = (event) => {
      setMessageState(null);

      const response = JSON.parse(event.data);

      const data = {
        response:
          response?.followup == true
            ? response?.response?.followup_question
            : response?.response,
        options: response?.response?.choices,
        sources: response?.sources,
        status: response?.status,
        source: response?.source,
        end: response?.end,
        resources: response?.resources,
      };
      console.log('Response #########################', data);

      if (data.status == true) {
        setMessageState(response?.response);
      } else if (data.end == true) {
        setMessageState('end');
      } else {
        if (data.sources !== undefined || data.response !== undefined) {
          console.log('response', data.response);
          setMessageState(null);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              chatResponse: data.response !== undefined ? data.response : null,
              options: data.options,
              isUser: false,
              userResponse: null,
              sources: data.sources ? data.sources : null,
              source: data.source ? data.source : null,
            },
          ]);
        } else if (data.resources !== undefined) {
          console.log('resources', data.resources);
          setMessageState(null);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              chatResponse: data.response !== undefined ? data.response : null,
              options: data.options,
              isUser: false,
              userResponse: null,
              sources: data.sources ? data.sources : null,
              source: data.source ? data.source : null,
              resources: data.resources ? data.resources : null,
            },
          ]);
        }
      }

      // setMessages((prevMessages) => [...prevMessages, data]);
    };

    websocket.onclose = () => {
      console.log('Disconnected from websocket');
    };

    // On error, log the error message.
    websocket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    // On closing the connection, log the reason.
    websocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.reason);
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (websocketRef.current) {
      websocketRef.current.send(userMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          chatResponse: userMessage,
          options: null,
          isUser: true,
          userResponse: userMessage,
        },
      ]);

      console.log(messages);
      setUserMessage('');
    }
  };

  function ChangeValue(e: any) {
    setUserMessage(e.target.value);
  }

  function chooseValue(option: string) {
    if (websocketRef.current) {
      websocketRef.current.send(option);
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1 ? { ...msg, options: null } : msg
        )
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          chatResponse: option,
          options: null,
          isUser: true,
          userResponse: option,
        },
      ]);

      setMessageState(null);
      setUserMessage('');
    }
  }

  function hostName(url: string, name: boolean = true) {
    const Uri = new URL(url);
    const host = Uri.hostname;

    return host;
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <React.Fragment>
      <div className="flex w-full flex-row justify-center items-center h-screen bg-gray-100 overflow-y-hidden">
        <div className="max-w-md md:rounded-lg  w-full h-full md:h-4/5 flex flex-col">
          <div className="flex-grow w-full flex flex-col justify-between bg-white rounded-lg overflow-y-scroll no-scrollbar">
            <div
              ref={chatContainerRef}
              className="flex-grow w-full overflow-y-scroll no-scrollbar"
            >
              {messages.length !== 0 && (
                <div className="flex justify-center text-sm text-[#979797] w-full my-6">
                  <div className="text-center">
                    The responses are only guidelines. Please double check if
                    you have doubts.
                  </div>
                </div>
              )}

              {messages?.map((message, index) => (
                <div className="py-1 px-2" key={index}>
                  {message.isUser === false ? (
                    <>
                      {(index === 0 ||
                        (index > 0 && messages[index - 1]?.isUser)) && (
                        <div className="py-2">
                          <img
                            src="/images/home/evva_chat.svg"
                            alt=""
                            className="h-10 w-auto"
                          />
                        </div>
                      )}
                      {message.chatResponse && (
                        <div className="flex flex-col">
                          <div className="bg-white text-Dark text-medium p-2 px-4 rounded-3xl max-w-[80%]">
                            {message.chatResponse}
                          </div>
                        </div>
                      )}

                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm text-gray-500">Sources</h3>
                          <div className="flex gap-2 overflow-x-scroll  mt-2">
                            {message.sources.map((item, index) => (
                              <div key={index} className="flex flex-col">
                                <Link
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={index}
                                >
                                  <div className="w-[180px] flex flex-col justify-between h-[130px] border-0 hover:border-2 hover:border-[#EDD072] bg-gray-100 hover:bg-[#FCF6E1] rounded-xl p-4">
                                    <h2 className="text-medium text-[#17191C]">
                                      {item.title}
                                    </h2>
                                    {item.source === 'url' && (
                                      <div className="flex flex-row justify-start gap-2">
                                        <img
                                          src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${item.href}`}
                                          alt="favicon"
                                          className="rounded-lg h-5 w-auto"
                                        />
                                        <h3 className="text-sm text-[#868686]">
                                          {hostName(item.href).slice(0, 16) +
                                            '...'}
                                        </h3>
                                      </div>
                                    )}

                                    {item.source === 'docs' && (
                                      <div className="flex flex-row justify-start gap-2">
                                        <img
                                          src={
                                            '/images/home/icons/documents.svg'
                                          }
                                          alt="favicon"
                                          className="rounded-lg h-5 w-auto"
                                        />
                                        <h3 className="text-medium text-[#868686]">
                                          Document
                                        </h3>
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {message.options && message.options.length !== 0 && (
                        <div className="mt-2 w-full flex flex-col gap-2">
                          <div className="text-[#606F90] text-base text-end">
                            Select an option
                          </div>
                          {message.options.map((option, index) => (
                            <div className="flex justify-end" key={index}>
                              <div
                                className="bg-white border border-[#273046] px-4 p-2 text-right rounded-3xl cursor-pointer"
                                onClick={() => {
                                  chooseValue(option);
                                }}
                              >
                                {option}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-end">
                      <div className="bg-chatBlue px-4 text-white bg-indigo-600 p-2 rounded-3xl max-w-[75%]">
                        {message.userResponse}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <MessageState messageState={messageState} />
            </div>
            <div className="flex items-center bg-white p-2 rounded-2xl">
              <input
                type="text"
                placeholder="Ask me something"
                className="px-4 py-4 w-full border-none outline-none placeholder:text-[16px] font-medium placeholder:text-[#475574]"
                value={userMessage}
                onChange={(e) => ChangeValue(e)}
              />
              <button
                className="flex items-center justify-center p-2 rounded-md text-white bg-gray-500"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
