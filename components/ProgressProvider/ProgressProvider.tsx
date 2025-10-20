"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingProviderProps {
  children: React.ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");

  useEffect(() => {
    const texts = ["Initializing", "Loading Assets", "Preparing Interface", "Almost Ready"];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return p + Math.random() * 15 + 10;
      });
    }, 150);
  }, []);

  if (isLoading) {
    return (
      <>
        {/* Style for media query */}
        <style>
          {`
            @media (max-width: 1023px) {
              .loading-screen {
                display: none;
              }
            }
          `}
        </style>

        {/* Animated loading screen for large screens only */}
        <div className="loading-screen fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#a10000] text-white">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes breathe {
                  0%,100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.05); opacity: 0.9; }
                }
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes gradientShift {
                  0%,100% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                }
              `,
            }}
          />

          {/* background gradient */}
          <div className="absolute inset-0 animate-[gradientShift_10s_ease_infinite] bg-gradient-to-br from-red-900 via-[#a10000] to-orange-800 bg-[length:200%_200%]" />

          {/* subtle moving lines (minimal) */}
          <div className="absolute top-1/3 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.5s_linear_infinite]" />
          <div className="absolute top-2/3 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_linear_infinite]" />

          {/* logo */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-48 h-48 flex items-center justify-center">
              <Image
                src="/images/telexlogo.webp"
                alt="TelexPH Logo"
                width={180}
                height={180}
                className="animate-[breathe_3s_ease_in_out_infinite]"
                priority
              />
            </div>

            {/* company name */}
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">
              Business Support Services Inc.
            </p>

            {/* progress bar */}
            <div className="w-72 h-2 bg-white/10 rounded-full overflow-hidden relative mt-4">
              <div
                className="h-full bg-gradient-to-r from-white via-red-300 to-white rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>

            {/* text + percent */}
            <div className="mt-3 flex items-center justify-between w-72 text-xs font-mono text-white/80">
              <span>{loadingText}...</span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
          </div>
        </div>

        {/* Simple loading screen for mobile/mid devices */}
        <div className="loading-screen fixed inset-0 z-[9999] flex-col items-center justify-center bg-[#a10000] text-white hidden lg:flex">
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-48 h-48 flex items-center justify-center">
              <Image
                src="/images/telexlogo.webp"
                alt="TelexPH Logo"
                width={180}
                height={180}
                priority
              />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">
              Business Support Services Inc.
            </p>
            <div className="w-72 h-2 bg-white/10 rounded-full overflow-hidden relative mt-4">
              <div
                className="h-full bg-white"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between w-72 text-xs font-mono text-white/80">
              <span>{loadingText}...</span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}