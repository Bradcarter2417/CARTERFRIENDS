"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "fade"
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const base = "transition-all duration-700 ease-out"
  const hidden: Record<string, string> = {
    up:    "opacity-0 translate-y-8",
    left:  "opacity-0 -translate-x-8",
    right: "opacity-0 translate-x-8",
    fade:  "opacity-0",
  }
  const shown = "opacity-100 translate-y-0 translate-x-0"

  return (
    <div
      ref={ref}
      className={`${base} ${visible ? shown : hidden[direction]} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  )
}
