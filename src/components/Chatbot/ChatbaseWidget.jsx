
import { useEffect } from "react";
const GHLChatWidget = () => {
  const WIDGET_ID = import.meta.env.VITE_GHL_WIDGET_ID;
  const SCRIPT_SRC = "https://widgets.leadconnectorhq.com/loader.js";
  const RESOURCES_URL = "https://widgets.leadconnectorhq.com/chat-widget/loader.js";
  useEffect(() => {
    if (!WIDGET_ID || navigator.webdriver) { // no widget in the build-time prerender snapshot
      return;
    }
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      console.log("GHL Chat Widget script already loaded.");
      return;
    }
    // Delay the widget until first interaction or 5s so it stays off the LCP/INP critical path.
    const EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"];
    let timer;
    const load = () => {
      clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.setAttribute("data-resources-url", RESOURCES_URL);
      script.setAttribute("data-widget-id", WIDGET_ID);
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load GHL Chat Widget script.");
      };
      document.body.appendChild(script);
    };
    EVENTS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    timer = setTimeout(load, 5000);
    return () => {
      clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      const existingScript = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
    };
  }, [WIDGET_ID]);
  return null;
};
var stdin_default = GHLChatWidget;
export {
  stdin_default as default
};
