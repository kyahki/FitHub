"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

type Theme = "orange-black" | "purple-white" | "black-white" | "maroon-gold" | "emerald-rose" | "navy-coral" | "system"

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("orange-black")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    localStorage.setItem("theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme, mounted])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("orange-black")}>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-8 overflow-hidden rounded">
              <div className="h-4 w-4 bg-orange-500"></div>
              <div className="h-4 w-4 bg-black"></div>
            </div>
            <span>Orange & Black</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("purple-white")}>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-8 overflow-hidden rounded">
              <div className="h-4 w-4 bg-purple-500"></div>
              <div className="h-4 w-4 bg-white border"></div>
            </div>
            <span>Purple & White</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("black-white")}>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-8 overflow-hidden rounded">
              <div className="h-4 w-4 bg-black"></div>
              <div className="h-4 w-4 bg-white border"></div>
            </div>
            <span>Black & White</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("maroon-gold")}>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-8 overflow-hidden rounded">
              <div className="h-4 w-4 bg-[#8B1A1A]"></div>
              <div className="h-4 w-4 bg-[#FFD700]"></div>
            </div>
            <span>Maroon & Gold</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("emerald-rose")}>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-8 overflow-hidden rounded">
              <div className="h-4 w-4 bg-emerald-600"></div>
              <div className="h-4 w-4 bg-pink-300"></div>
            </div>
            <span>Emerald & Rose</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("navy-coral")}>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-8 overflow-hidden rounded">
              <div className="h-4 w-4 bg-[#1B365D]"></div>
              <div className="h-4 w-4 bg-[#FF7F50]"></div>
            </div>
            <span>Navy & Coral</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
