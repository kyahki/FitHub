"use client"

import { useMemo } from "react"

interface WorkoutDay {
  _id: string
  count: number
  totalDuration: number
}

interface WorkoutHeatmapProps {
  data: WorkoutDay[]
}

export function WorkoutHeatmap({ data }: WorkoutHeatmapProps) {
  // Generate last 12 weeks of dates
  const calendarData = useMemo(() => {
    const today = new Date()
    const calendar: { date: string; count: number }[][] = []

    // Create 7 rows (days of week)
    for (let i = 0; i < 7; i++) {
      calendar.push([])
    }

    // Fill with last 12 weeks (84 days)
    for (let i = 83; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const dateStr = date.toISOString().split("T")[0]
      const dayOfWeek = date.getDay()
      const workoutDay = data.find((d) => d._id === dateStr)

      calendar[dayOfWeek].push({
        date: dateStr,
        count: workoutDay ? workoutDay.count : 0,
      })
    }

    return calendar
  }, [data])

  // Get color based on workout count
  const getColor = (count: number) => {
    if (count === 0) return "bg-muted-foreground/20"
    if (count === 1) return "bg-primary/30"
    if (count === 2) return "bg-primary/60"
    return "bg-primary"
  }

  // Get day labels
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get month labels
  const monthLabels = useMemo(() => {
    const today = new Date()
    const months = []
    const currentMonth = today.getMonth()

    // Go back 3 months
    for (let i = 3; i >= 0; i--) {
      const month = new Date()
      month.setMonth(currentMonth - i)
      months.push(month.toLocaleString("default", { month: "short" }))
    }

    return months
  }, [])

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        {monthLabels.map((month, i) => (
          <div key={i}>{month}</div>
        ))}
      </div>
      <div className="flex">
        <div className="mr-2 flex flex-col justify-between text-xs text-muted-foreground">
          {dayLabels.map((day, i) => (
            <div key={i} className="h-8 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid w-full grid-rows-7 gap-1">
          {calendarData.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-flow-col gap-1">
              {row.map((day, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`h-8 w-8 rounded-sm ${getColor(day.count)}`}
                  title={`${day.date}: ${day.count} workouts`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
