import express from "express"
import { updateProfile, updatePassword } from "../controllers/user.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// Protect all routes
router.use(protect)

router.put("/profile", updateProfile)
router.put("/password", updatePassword)

export default router
