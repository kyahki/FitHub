import express from "express"
import {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
} from "../controllers/workout.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// Protect all routes
router.use(protect)

router.route("/").get(getWorkouts).post(createWorkout)

router.get("/stats", getWorkoutStats)

router.route("/:id").get(getWorkout).put(updateWorkout).delete(deleteWorkout)

export default router
