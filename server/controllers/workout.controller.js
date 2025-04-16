import Workout from "../models/workout.model.js"

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user.id

    const workout = await Workout.create(req.body)

    res.status(201).json({
      success: true,
      data: workout,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get all workouts for a user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req, res) => {
  try {
    // Build query
    const query = { user: req.user.id }

    // Date filtering
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      }
    } else if (req.query.startDate) {
      query.date = { $gte: new Date(req.query.startDate) }
    } else if (req.query.endDate) {
      query.date = { $lte: new Date(req.query.endDate) }
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit

    const total = await Workout.countDocuments(query)
    const workouts = await Workout.find(query).sort({ date: -1 }).skip(startIndex).limit(limit)

    res.status(200).json({
      success: true,
      count: workouts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: workouts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      })
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this workout",
      })
    }

    res.status(200).json({
      success: true,
      data: workout,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      })
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this workout",
      })
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: workout,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      })
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this workout",
      })
    }

    await workout.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get workout stats
// @route   GET /api/workouts/stats
// @access  Private
export const getWorkoutStats = async (req, res) => {
  try {
    // Get workout count by day (for heatmap)
    const workoutsByDay = await Workout.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get exercise frequency
    const exerciseFrequency = await Workout.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: "$exercises" },
      {
        $group: {
          _id: "$exercises.name",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    // Calculate current streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const workoutDates = workoutsByDay.map(w => new Date(w._id))
    let currentStreak = 0
    let checkDate = today

    while (workoutDates.some(date => date.getTime() === checkDate.getTime())) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }

    // Calculate workouts this week
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const workoutsThisWeek = workoutsByDay.filter(w => {
      const workoutDate = new Date(w._id)
      return workoutDate >= startOfWeek && workoutDate <= today
    }).length

    res.status(200).json({
      success: true,
      data: {
        workoutsByDay,
        exerciseFrequency,
        currentStreak,
        workoutsThisWeek
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
