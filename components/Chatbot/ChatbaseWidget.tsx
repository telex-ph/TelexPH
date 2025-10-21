"use client";

import React, { useEffect, useState } from "react";

const ChatbaseWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const CHATBOT_ID = process.env.NEXT_PUBLIC_CHATBASE_ID;
    const DOMAIN = process.env.NEXT_PUBLIC_CHATBASE_DOMAIN;

    if (!CHATBOT_ID || !DOMAIN) {
      console.error("Chatbase environment variables are missing.");
      return;
    }

    // Only load script once
    if (!document.getElementById(CHATBOT_ID)) {
      window.embeddedChatbotConfig = {
        chatbotId: CHATBOT_ID,
        domain: DOMAIN,
      };

      const script = document.createElement("script");
      script.src = `https://${DOMAIN}/embed.min.js`;
      script.id = CHATBOT_ID;
      script.async = true;
      script.setAttribute("domain", DOMAIN);
      script.setAttribute("chatbotId", CHATBOT_ID);
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#a10000] text-white w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center text-2xl"
      >
        {isOpen ? "×" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-80 h-[500px] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 z-40"
          style={{ transition: "all 0.3s ease-in-out" }}
        >
          <iframe
            src={`https://${process.env.NEXT_PUBLIC_CHATBASE_DOMAIN}/chatbot-iframe/${process.env.NEXT_PUBLIC_CHATBASE_ID}`}
            title="TelexPH Chatbot"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </div>
      )}
    </>
  );
};

export default ChatbaseWidget;
