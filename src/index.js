const express = require('express');

require('./db/mongoose');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("My Server is listening on port: " + port);
});

const Task = require('./models/task')
const User = require('./models/user');

// const main = async () => {
  // const task = await Task.findById('5ef7775d3c9a5ffc408f8d13')
  // await task.populate('owner').execPopulate();
  // console.log(task.owner.name);
//5ef777063c9a5ffc408f8d10
// const user = await User.findById('5ef777063c9a5ffc408f8d10');
// await user.populate('tasks').execPopulate();
// console.log(user.tasks);
// }

// main();