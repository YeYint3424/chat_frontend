"use client";
import { useEffect, useState } from "react";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch("http://localhost:4000/messages");
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();

    const eventSource = new EventSource("http://localhost:4000/events");

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Update the message state
  };

  const sendMessage = async () => {
    if (!username || !message) return;
    await fetch("http://localhost:4000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: username, text: message }),
    });
    const fetchMessages = async () => {
      const response = await fetch("http://localhost:4000/messages");
      const data = await response.json();
      setMessages(data);
    };

    setUsername("");
    setMessage("");
    fetchMessages();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Chat Room</h1>
      <div className="mb-4">
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your name"
          className="p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Messages:</h2>
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className="flex">
              <strong className="text-blue-600 mr-2">{msg.username}:</strong>
              <span className="text-gray-800">{msg.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-full max-w-md">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type your message"
          className="p-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring focus:ring-blue-400 flex-grow mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
