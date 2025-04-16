"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { workoutService } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function NewWorkoutPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [workout, setWorkout] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    duration: 0,
    feeling: "good",
    notes: "",
    exercises: [{ name: "", sets: [{ weight: 0, reps: 0 }], notes: "" }],
  })

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWorkout((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFeelingChange = (value: string) => {
    setWorkout((prev) => ({
      ...prev,
      feeling: value,
    }))
  }

  const handleExerciseChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedExercises = [...workout.exercises]
    updatedExercises[index] = {
      ...updatedExercises[index],
      [name]: value,
    }
    setWorkout((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }))
  }

  const handleSetChange = (exerciseIndex: number, setIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedExercises = [...workout.exercises]
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [name]: Number.parseInt(value) || 0,
    }
    setWorkout((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }))
  }

  const addExercise = () => {
    setWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: [{ weight: 0, reps: 0 }], notes: "" }],
    }))
  }

  const removeExercise = (index: number) => {
    const updatedExercises = [...workout.exercises]
    updatedExercises.splice(index, 1)
    setWorkout((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }))
  }

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...workout.exercises]
    updatedExercises[exerciseIndex].sets.push({ weight: 0, reps: 0 })
    setWorkout((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }))
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...workout.exercises]
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1)
    setWorkout((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      await workoutService.createWorkout(workout)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating workout:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            <span className="text-xl font-bold">FitHub</span>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center">
            <Link href="/dashboard" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">New Workout</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Workout Details</CardTitle>
                <CardDescription>Enter the basic information about your workout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Workout Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Leg Day"
                      value={workout.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" value={workout.date} onChange={handleChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="0"
                      value={workout.duration.toString()}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feeling">How did it feel?</Label>
                    <Select value={workout.feeling} onValueChange={handleFeelingChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feeling" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="great">Great</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="okay">Okay</SelectItem>
                        <SelectItem value="bad">Bad</SelectItem>
                        <SelectItem value="terrible">Terrible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="How was your workout?"
                    value={workout.notes}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {workout.exercises.map((exercise, exerciseIndex) => (
              <Card key={exerciseIndex} className="mb-6">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Exercise {exerciseIndex + 1}</CardTitle>
                    <CardDescription>Record your sets and reps</CardDescription>
                  </div>
                  {workout.exercises.length > 1 && (
                    <Button variant="ghost" size="icon" type="button" onClick={() => removeExercise(exerciseIndex)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`exercise-${exerciseIndex}-name`}>Exercise Name</Label>
                    <Input
                      id={`exercise-${exerciseIndex}-name`}
                      name="name"
                      placeholder="Squat"
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(exerciseIndex, e)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sets</Label>
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="mt-2 grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-1 text-sm font-medium text-muted-foreground">{setIndex + 1}</div>
                        <div className="col-span-5">
                          <Input
                            id={`exercise-${exerciseIndex}-set-${setIndex}-weight`}
                            name="weight"
                            type="number"
                            min="0"
                            placeholder="Weight"
                            value={set.weight.toString()}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, e)}
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            id={`exercise-${exerciseIndex}-set-${setIndex}-reps`}
                            name="reps"
                            type="number"
                            min="0"
                            placeholder="Reps"
                            value={set.reps.toString()}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, e)}
                          />
                        </div>
                        <div className="col-span-1">
                          {exercise.sets.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              onClick={() => removeSet(exerciseIndex, setIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => addSet(exerciseIndex)}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Set
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exercise-${exerciseIndex}-notes`}>Notes</Label>
                    <Textarea
                      id={`exercise-${exerciseIndex}-notes`}
                      name="notes"
                      placeholder="Any notes about this exercise?"
                      value={exercise.notes}
                      onChange={(e) => handleExerciseChange(exerciseIndex, e)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" type="button" onClick={addExercise} className="mb-6 w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>

            <div className="flex justify-end gap-4">
              <Link href="/dashboard">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Workout"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <footer className="border-t py-4 md:py-6">
        <div className="container flex flex-col gap-2 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FitHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
