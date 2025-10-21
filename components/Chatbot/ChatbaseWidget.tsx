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

    // Prevent duplicate script load
    if (document.getElementById(CHATBOT_ID)) return;

    window.embeddedChatbotConfig = {
      chatbotId: CHATBOT_ID,
      domain: DOMAIN,
    };

    const script = document.createElement("script");
    script.src = `https://${DOMAIN}/embed.min.js`;
    script.id = CHATBOT_ID;
    script.async = true;
    script.onload = () => {
      console.log("Chatbase script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Chatbase script");
    };
    document.body.appendChild(script);

    return () => {
      const chatbaseScript = document.getElementById(CHATBOT_ID);
      if (chatbaseScript) document.body.removeChild(chatbaseScript);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);

    const iframe = document.querySelector("iframe[src*='chatbase']") as HTMLElement;
    if (iframe) {
      iframe.style.display = isOpen ? "none" : "block";
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#a10000",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </>
  );
};

export default ChatbaseWidget;
