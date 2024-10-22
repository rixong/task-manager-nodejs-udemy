const express = require('express');
const Task = require('../models/task');
const router = new express.Router;
const auth = require('../middleware/auth')

// create Task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
})

// READ ALL TASKS FOR LOGGED IN USER
//  GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_desc

router.get('/tasks', auth, async (req, res) => {
  const match = {};
  let sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    let parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  console.log(sort);

  try {
    // const tasks = await Task.find({owner: req.user._id}) //line below in alternate
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    if (!req.user.tasks) {
      res.status(404).send()
    }
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Read specific task
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(exports)
  }
})

// Update tasks
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed']

  const isValidOperation = updates.every(update => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({ error: "Not a valid update!" })
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.send(task)
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;