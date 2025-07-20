import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, User, Bot } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        sender: "dalal",
        text: "Hello! I'm Dalal, your AI staffing assistant. I'm here to help you find the perfect job opportunities or candidates. How can I assist you today?",
        complete: true,
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input.trim() }]);
    setIsTyping(true);
    setError("");
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
      }, 20);
    } catch (err) {
      setError("Sorry, I'm having trouble responding right now. Please try again.");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-apple bg-primary-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Chat with Dalal</h1>
            <p className="text-sm text-gray-600">Your AI staffing assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} sender={msg.sender} text={msg.text} />
          ))}
          {isTyping && (
            <div className="flex items-start space-x-3 justify-start">
              <img 
                src="/dalal.png" 
                alt="Dalal" 
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="chat-bubble chat-bubble-bot">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <div className="bg-red-50 border border-red-200 rounded-apple px-4 py-2 text-red-700 text-sm">
                {error}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isTyping}
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-apple focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";

  if (isUser) {
    // User message - right aligned
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start space-x-3 justify-end"
      >
        <div className="chat-bubble chat-bubble-user text-sm">
          {text}
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      </motion.div>
    );
  } else {
    // Bot message - left aligned
    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start space-x-3 justify-start"
      >
        <img 
          src="/dalal.png" 
          alt="Dalal" 
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="chat-bubble chat-bubble-bot text-sm">
          {text}
        </div>
      </motion.div>
    );
  }
};

export default Chat;
