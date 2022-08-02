const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

// start mongo server // PS C:\Users\awell\mongodb\bin> ./mongod.exe --dbpath="../../mongodb-data"
// app.use((req, res, next) => {
//   res.status(503).send("Site is currently down. Check back soon!");
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
