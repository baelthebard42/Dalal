// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const dummyUserDP =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSA1zygA3rubv-VK0DrVcQ02Po79kJhXo_A&s";
const dalalDP =
  "https://static.vecteezy.com/system/resources/previews/007/225/199/non_2x/robot-chat-bot-concept-illustration-vector.jpg";

const Chat = () => {
  const [messages, setMessages] = useState([]); // { sender: 'user'|'dalal', text: string }
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input.trim() }]);
    setIsTyping(true);
    const prompt = input.trim();
    setInput("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/dalal/response",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dalalResponse = res.data.response;

      // Animate typing effect
      let index = 0;
      let animatedText = "";

      const interval = setInterval(() => {
        if (index < dalalResponse.length) {
          animatedText += dalalResponse.charAt(index);
          setMessages((prev) => {
            const newMessages = [...prev];
            // Replace last dalal message or add new
            if (
              newMessages.length > 0 &&
              newMessages[newMessages.length - 1].sender === "dalal" &&
              !newMessages[newMessages.length - 1].complete
            ) {
              newMessages[newMessages.length - 1].text = animatedText;
            } else {
              newMessages.push({
                sender: "dalal",
                text: animatedText,
                complete: false,
              });
            }
            return newMessages;
          });
          index++;
        } else {
          clearInterval(interval);
          // Mark message as complete
          setMessages((prev) => {
            const newMessages = [...prev];
            if (
              newMessages.length > 0 &&
              newMessages[newMessages.length - 1].sender === "dalal"
            ) {
              newMessages[newMessages.length - 1].complete = true;
            }
            return newMessages;
          });
          setIsTyping(false);
        }
      }, 25);
    } catch (err) {
      alert("Error getting response from Dalal");
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-screen p-4">
      <h2 className="text-3xl font-bold mb-4">Chat with Dalal</h2>
      <div className="flex-1 overflow-auto mb-4 p-4 border rounded bg-white shadow">
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-grow border rounded px-3 py-2"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isTyping}
        />
        <button
          className="btn"
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";
  const dp = isUser ? dummyUserDP : dalalDP;

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 items-start ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img src={dp} alt="Dalal" className="w-10 h-10 rounded-full mr-3" />
      )}
      <div
        className={`max-w-[70%] p-3 rounded-lg whitespace-pre-wrap text-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {text}
      </div>
      {isUser && (
        <img src={dp} alt="User" className="w-10 h-10 rounded-full ml-3" />
      )}
    </motion.div>
  );
};

export default Chat;
