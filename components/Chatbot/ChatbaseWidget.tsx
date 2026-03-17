"use client";

import React, { useEffect } from "react";

const GHLChatWidget = () => {
  const WIDGET_ID = process.env.NEXT_PUBLIC_GHL_WIDGET_ID;

  const SCRIPT_SRC = "https://widgets.leadconnectorhq.com/loader.js";
  const RESOURCES_URL = "https://widgets.leadconnectorhq.com/chat-widget/loader.js";

  useEffect(() => {
    if (!WIDGET_ID) {
      console.error("GHL Widget ID is missing. Check your .env.local file.");
      return;
    }

    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      console.log("GHL Chat Widget script already loaded.");
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.setAttribute("data-resources-url", RESOURCES_URL);
    script.setAttribute("data-widget-id", WIDGET_ID);
    script.async = true;

    script.onload = () => {
      console.log("GHL Chat Widget loaded successfully.");
    };

    script.onerror = () => {
      console.error("Failed to load GHL Chat Widget script.");
    };

    document.body.appendChild(script);
    return () => {
      const existingScript = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
    };
  }, [WIDGET_ID]); 

  return null;
};

export default GHLChatWidget;