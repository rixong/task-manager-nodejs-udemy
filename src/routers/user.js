const express = require('express');
const router = new express.Router;
const User = require('../models/user');
const auth = require('../middleware/auth');
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')

//Create New User

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken();
    res.status(201).send({user, token})
  } catch (e) {
    res.status(400).send(e)
  }
});

// LOGIN
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken()
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
})

//GET LOGGED IN USER'S PROFILE
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
});

//LOGOUT - Single device
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save();
    res.send()
  } catch (e) {
    res.status(500).send();
  }
})

//LOGOUT - all devices
router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }

});

// Update user by ID
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', "email", "password", "age"]
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" })
  }
  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
});

// DELETE USER BY ID
router.delete('/users/me', auth, async (req, res) => {
  const _id = req.user._id

  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
});

module.exports = router;