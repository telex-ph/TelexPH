'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const SLIDE_IMAGES = [
  '/images/post1.webp',
  '/images/post5.webp',
  '/images/partnership9.jpg',
  '/images/partnership6.jpg',
  '/images/partnership8.jpg',
  '/images/partnership2.jpg',
  '/images/partnership4.jpg',
]

const SLIDE_DURATION = 5000

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function WelcomeSlideshow() {
  const [order, setOrder] = useState(SLIDE_IMAGES)
  const [active, setActive] = useState(0)

  useEffect(() => {
    setOrder(shuffle(SLIDE_IMAGES))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % order.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [order.length])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {order.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  )
}
