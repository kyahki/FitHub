"use client"

import { useEffect, useState } from "react"

const slogans = [
  "Every Rep is a Commit to Yourself.",
  "Push your workouts, build your gains — one log at a time.",
  "Track Workouts Like a Developer.",
  "Daily fitness logs, visualized like GitHub commits.",
  "Fitness Meets Version Control.",
  "Push your workout. Track your growth.",
  "Push Reps Like Commits.",
  "Your fitness progress, version-controlled.",
]

export function AnimatedText() {
  const [currentSlogan, setCurrentSlogan] = useState(0)
  const [fadeState, setFadeState] = useState("fade-in")

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out")

      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % slogans.length)
        setFadeState("fade-in")
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <p
      className={`max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed transition-opacity duration-500 ${
        fadeState === "fade-in" ? "opacity-100" : "opacity-0"
      }`}
    >
      {slogans[currentSlogan]}
    </p>
  )
}
