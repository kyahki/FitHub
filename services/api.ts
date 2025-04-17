import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

interface RegisterUserData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

interface UpdateProfileData {
  firstName?: string
  lastName?: string
  email?: string
}

// Auth services
export const authService = {
  register: async (userData: RegisterUserData) => {
    const response = await api.post("/auth/register", userData)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  },

  logout: async () => {
    localStorage.removeItem("token")
    const response = await api.get("/auth/logout")
    return response.data
  },

  getMe: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },

  updatePassword: async (data: UpdatePasswordData) => {
    const response = await api.put("/auth/password", data)
    return response.data
  },
}

// Workout services
export const workoutService = {
  getWorkouts: async (params = {}) => {
    const response = await api.get("/workouts", { params })
    return response.data
  },

  getWorkout: async (id: string) => {
    const response = await api.get(`/workouts/${id}`)
    return response.data
  },

  createWorkout: async (workoutData: any) => {
    const response = await api.post("/workouts", workoutData)
    return response.data
  },

  updateWorkout: async (id: string, workoutData: any) => {
    const response = await api.put(`/workouts/${id}`, workoutData)
    return response.data
  },

  deleteWorkout: async (id: string) => {
    const response = await api.delete(`/workouts/${id}`)
    return response.data
  },

  getWorkoutStats: async () => {
    const response = await api.get("/workouts/stats")
    return response.data
  },
}

// User services
export const userService = {
  updateProfile: async (userData: UpdateProfileData) => {
    const response = await api.put("/users/profile", userData)
    return response.data
  },

  updatePassword: async (passwordData: UpdatePasswordData) => {
    const response = await api.put("/users/password", passwordData)
    return response.data
  },
}

export default api
