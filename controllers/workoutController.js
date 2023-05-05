const Workout = require('../models/workoutsModel')
const mongoose = require('mongoose')

// get all workouts 
const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({}).sort({ createAt: -1 })  // find({這裡放條件 沒放就是全部})

  res.status(200).json(workouts)
}

// get a single workout 
const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }

  const workout = await Workout.findById(id)
  if (!workout) {
    return res.status(404).json({ error: '沒有這個workout' })
  }

  res.status(200).json(workout)
}

// create new workout
const createWorkout = async (req, res) => {
  const { si, la, sol, fa, mi, re, dol } = req.body

  // add doc to db
  try {
    const workout = await Workout.create({ si, la, sol, fa, mi, re, dol })
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: '沒有這組健身運動No such workout' })
  }

  const workout = await Workout.findOneAndDelete({ _id: id })

  if (!workout) {
    return res.status(400).json({ error: '沒有這組健身運動No such workout' })
  }

  res.status(200).json(workout)
}

// update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: '沒有這組健身運動No such workout' })
  }

  const workout = await Workout.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!workout) {
    return res.status(400).json({ error: '沒有這組健身運動No such workout' })
  }

  res.status(200).json(workout)

}



module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}