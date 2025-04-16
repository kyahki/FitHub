import mongoose from "mongoose"

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Exercise name is required"],
    trim: true,
  },
  sets: [
    {
      weight: {
        type: Number,
        required: [true, "Weight is required"],
      },
      reps: {
        type: Number,
        required: [true, "Reps are required"],
      },
      completed: {
        type: Boolean,
        default: true,
      },
    },
  ],
  notes: {
    type: String,
    trim: true,
  },
})

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    title: {
      type: String,
      required: [true, "Workout title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Workout date is required"],
      default: Date.now,
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    exercises: [exerciseSchema],
    notes: {
      type: String,
      trim: true,
    },
    feeling: {
      type: String,
      enum: ["great", "good", "okay", "bad", "terrible"],
      default: "good",
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying by user and date
workoutSchema.index({ user: 1, date: -1 })

const Workout = mongoose.model("Workout", workoutSchema)

export default Workout
