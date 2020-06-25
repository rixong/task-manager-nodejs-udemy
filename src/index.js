const express = require('express');
// const path = require('path');
require('./db/mongoose');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter, taskRouter)
// app.use(taskRouter)

app.listen(port, () => {
  console.log("My Server is listening on port: " + port);
});
