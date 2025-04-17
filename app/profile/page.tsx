"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { authService } from "@/services/api"
export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    height: "",
    weight: "",
  })

  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState<string>("");

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const calculateBMI = () => {
    const heightInMeters = parseFloat(formData.height) / 100
    const weightInKg = parseFloat(formData.weight)

    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters)
      setBmi(parseFloat(bmiValue.toFixed(1)))

      // Determine BMI category
      if (bmiValue < 18.5) {
        setBmiCategory("Underweight")
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory("Normal weight")
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory("Overweight")
      } else {
        setBmiCategory("Obese")
      }
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    try {
      setIsSubmitting(true)
      await authService.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      setSuccess("Password changed successfully")
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to change password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8 gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="transition-transform hover:scale-105 active:scale-95">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription className="text-green-600">{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BMI Calculator</CardTitle>
            <CardDescription>Calculate your Body Mass Index (BMI)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  placeholder="Enter your height"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <Button onClick={calculateBMI} type="button">
                Calculate BMI
              </Button>

              {bmi !== null && (
                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <p className="text-lg font-semibold">Your BMI: {bmi}</p>
                  <p className="text-sm text-muted-foreground">Category: {bmiCategory}</p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>BMI Categories:</p>
                    <ul className="list-disc list-inside">
                      <li>Underweight: &lt; 18.5</li>
                      <li>Normal weight: 18.5 - 24.9</li>
                      <li>Overweight: 25 - 29.9</li>
                      <li>Obese: ≥ 30</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}