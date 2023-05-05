const mongoose = require('mongoose')

const Schema = mongoose.Schema

const workourSchema = new Schema({
  si: {
    type: [Number],
    required: true
  },
  la: {
    type: [Number],
    required: true
  },
  sol: {
    type: [Number],
    required: true
  },
  fa: {
    type: [Number],
    required: true
  },
  mi: {
    type: [Number],
    required: true
  },
  re: {
    type: [Number],
    required: true
  },
  dol: {
    type: [Number],
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workourSchema)