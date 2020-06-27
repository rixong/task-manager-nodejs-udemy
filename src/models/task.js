const mongoose = require('mongoose');
const { ObjectID, ObjectId } = require('mongodb');
// const validator = require('validator');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

const Task = mongoose.model('Task', taskSchema)

taskSchema.pre('save', async function(next) {
  this.save();
  next()
})

module.exports = Task