// ChatbaseWidget.tsx (FINAL UPDATED VERSION)

import React, { useEffect } from 'react';

const ChatbaseWidget = () => {
  useEffect(() => {
    
    const CHATBOT_ID = "U6iDr67zbCRTktVf-0apo"; 
    const DOMAIN = "www.chatbase.co";

    window.embeddedChatbotConfig = {
      chatbotId: CHATBOT_ID,
      domain: DOMAIN, 
    };

    const script = document.createElement("script");
    
    script.src = "https://www.chatbase.co/embed.min.js"; 
    script.id = CHATBOT_ID; 
    
    script.setAttribute("domain", DOMAIN);
    script.setAttribute("chatbotId", CHATBOT_ID);

    document.body.appendChild(script);

    return () => {
      const chatbaseScript = document.getElementById(CHATBOT_ID);
      if (chatbaseScript) {
        document.body.removeChild(chatbaseScript);
      }
    };
  }, []); 

  return null; 
};

export default ChatbaseWidget;
