import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm CalmBridge AI, your mental wellness companion. I'm here to listen and support you. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Auto-scroll reference
  const messagesEndRef = useRef(null);

  // 🔹 Crisis keywords
  const crisisKeywords = [
    "suicide",
    "kill myself",
    "end my life",
    "self harm",
    "want to die",
    "no reason to live",
    "hopeless",
  ];

  const isCrisisMessage = (text) =>
    crisisKeywords.some((word) =>
      text.toLowerCase().includes(word)
    );

  // 🔹 Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);


  // 🔹 Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
    ]);
    setInput("");

    // 🚨 Crisis detection (client-side safety)
    if (isCrisisMessage(userText)) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "I'm really sorry you're feeling this way. You’re not alone. If you're in immediate danger, please call 988 (Suicide & Crisis Lifeline) right now or reach out to someone you trust.",
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:5000/chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userText }),
        });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.response ||
            "I'm here with you. Would you like to talk more about it?",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "I'm having trouble responding right now. Please consider reaching out to a trusted person or professional.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Chat Support
        </h1>
        <p className="text-center text-sm text-gray-600 mt-1">
          Talk to our AI assistant for emotional support and coping strategies
        </p>

        {/* Chat Container */}
        <div className="mt-8 bg-white rounded-xl shadow border border-gray-200 overflow-hidden">

          {/* Messages */}
          <div className="h-80 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? messagesEndRef : null}
                className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FaRobot className="text-emerald-600 text-sm" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${msg.sender === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-800"
                    }`}
                >
                  {msg.text}

                  {msg.text.includes("988") && (
                    <a
                      href="tel:988"
                      className="block mt-2 text-xs font-medium text-emerald-600 underline"
                    >
                      Call 988 Suicide & Crisis Lifeline
                    </a>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500">
                CalmBridge AI is typing…
              </div>
            )}
          </div>


          {/* Input */}
          <div className="border-t border-gray-200 px-4 py-3 flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <FaPaperPlane />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-xs text-gray-500 px-4 py-2">
            This is not a substitute for professional mental health care. If
            you're in crisis, please call <strong>988</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
