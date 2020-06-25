const express = require('express');
const Task = require('../models/task');
const router = new express.Router;

// create Task
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Read all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Read specific task
router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id)
    if (!task) {
      res.status(404).send(e)
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(exports)
  }
})

// Update tasks
router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed']

  const isValidOperation = updates.every(update => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({ error: "Not a valid update!" })
  }
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try{
    const task = await Task.findByIdAndDelete(req.params.id);
    if(!task){
      return res.status(404).send();
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;