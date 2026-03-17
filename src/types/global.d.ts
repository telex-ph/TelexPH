declare global {
  interface Window {
    embeddedChatbotConfig: {
      chatbotId: string;
      domain: string;
      themeColor?: string;
    };
  }
}
export {};