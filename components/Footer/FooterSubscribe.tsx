"use client";

import React, { useState } from "react";
import { getApiBaseUrl } from "@/lib/api-base";

type SubmitStatus = "idle" | "loading" | "success" | "error";

// Simple email guard — good enough for a client-side gate before hitting the API.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FooterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  const isLoading = status === "loading";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setStatus("error");
      setMessage("A valid email is required.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${getApiBaseUrl()}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("Thanks! You're subscribed.");
        return;
      }

      if (res.status === 400) {
        const data = await res.json().catch(() => null);
        setStatus("error");
        setMessage(data?.error ?? "A valid email is required.");
        return;
      }

      console.error("[newsletter] unexpected response", res.status, await res.text().catch(() => ""));
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } catch (err) {
      console.error("[newsletter] request failed", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-poppins-black mb-2 text-base text-white">Subscribe Now</h3>
        <div className="w-12 h-1 bg-[#a10000]"></div>
      </div>

      <p className="text-xs sm:text-sm text-gray-300 mb-3">
        Subscribe our newsletter to get the latest news and updates!
      </p>
      <form onSubmit={handleSubmit} className="flex border border-gray-500 rounded overflow-hidden">
        <input
          type="email"
          aria-label="Email address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="px-3 py-1.5 sm:py-2 w-full bg-transparent text-xs sm:text-sm focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading}
          aria-label="Subscribe"
          className="bg-[#a10000] px-4 text-sm disabled:opacity-60"
        >
          {isLoading ? (
            <span
              aria-hidden="true"
              className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
            ></span>
          ) : (
            "→"
          )}
        </button>
      </form>

      <p
        aria-live="polite"
        className={`mt-2 text-xs sm:text-sm min-h-[1rem] ${
          status === "success"
            ? "text-green-400"
            : status === "error"
            ? "text-[#a10000]"
            : ""
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default FooterSubscribe;
