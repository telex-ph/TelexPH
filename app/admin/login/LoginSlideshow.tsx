'use client'

import { useEffect, useState } from 'react'
import { loginSlides } from './LoginIllustrations'

const SLIDE_DURATION = 4500

export default function LoginSlideshow({
  showCaption = true,
  dark = false,
}: {
  showCaption?: boolean
  dark?: boolean
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % loginSlides.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="relative w-full max-w-[220px] aspect-square">
        {loginSlides.map((slide, i) => {
          const Illustration = slide.Illustration
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                i === active
                  ? 'opacity-100 translate-x-0 scale-100'
                  : i < active
                    ? 'opacity-0 -translate-x-6 scale-95'
                    : 'opacity-0 translate-x-6 scale-95'
              }`}
              aria-hidden={i !== active}
            >
              <Illustration />
            </div>
          )
        })}
      </div>

      {showCaption && (
        <div className="relative z-10 text-center w-full max-w-[300px] mt-4 min-h-[20px]">
          {loginSlides.map((slide, i) => (
            <p
              key={slide.id}
              className={`absolute inset-x-0 font-semibold text-sm font-poppins whitespace-nowrap transition-all duration-500 ease-out ${
                dark ? 'text-white' : 'text-[#800000]'
              } ${i === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
            >
              {slide.title}
            </p>
          ))}
        </div>
      )}

      <div className="relative z-10 flex items-center gap-2 mt-3">
        {loginSlides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active
                ? dark
                  ? 'w-6 bg-white'
                  : 'w-6 bg-[#800000]'
                : dark
                  ? 'w-1.5 bg-white/30'
                  : 'w-1.5 bg-[#800000]/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
