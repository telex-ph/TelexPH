"use client";

import React, { useEffect } from "react";

const ChatbaseWidget = () => {
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

  return null;
};

export default ChatbaseWidget;
