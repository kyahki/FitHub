"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { register, loading, error, clearError } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    if (id === "password" || id === "confirmPassword") {
      if (id === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError("Passwords do not match")
      } else if (id === "confirmPassword" && formData.password && value !== formData.password) {
        setPasswordError("Passwords do not match")
      } else {
        setPasswordError("")
      }
    }

    if (error) clearError()
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (!termsAccepted) {
      return
    }

    const { confirmPassword, ...userData } = formData
    await register(userData)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />
        {passwordError && <p className="text-sm text-destructive mt-1">{passwordError}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          required
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            terms of service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            privacy policy
          </a>
        </Label>
      </div>
      <Button type="submit" className="w-full" disabled={loading || !!passwordError}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
