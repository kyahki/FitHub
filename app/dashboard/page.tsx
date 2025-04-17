"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { workoutService } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus, Dumbbell, TrendingUp, LogOut } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Link from "next/link"
import { WorkoutHeatmap } from "@/components/workout-heatmap"

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [statsRes, workoutsRes] = await Promise.all([
            workoutService.getWorkoutStats(),
            workoutService.getWorkouts({ limit: 5 }),
          ])

          setStats(statsRes.data)
          setRecentWorkouts(workoutsRes.data)
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
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
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/profile" className="transition-transform hover:scale-105 active:scale-95">
            <span className="text-sm font-medium">Welcome, {user.firstName}</span>
            </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Link href="/workouts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Workout
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats?.workoutsByDay?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats?.currentStreak || 0} days</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats?.workoutsThisWeek || 0} workouts</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats?.exerciseFrequency?.length > 0 ? stats.exerciseFrequency[0]._id : "None"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Workout Activity</CardTitle>
              <CardDescription>Your workout consistency over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <p>Loading...</p>
                </div>
              ) : (
                <WorkoutHeatmap data={stats?.workoutsByDay || []} />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
              <CardDescription>Your last 5 workout sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <p>Loading...</p>
                </div>
              ) : recentWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {recentWorkouts.map((workout) => (
                    <div key={workout._id} className="flex items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{workout.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(workout.date).toLocaleDateString()} • {workout.exercises.length} exercises
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{workout.duration} min</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground">No workouts yet</p>
                  <Link href="/workouts/new">
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add your first workout
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
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
