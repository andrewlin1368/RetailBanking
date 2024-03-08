const express = require("express");
const userRouter = express.Router();
const verifyToken = require("../middleware.js");
const { login } = require("../../db/index.js");
const { error } = require("console");

userRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (
      !username ||
      !password ||
      (username && !username.length) ||
      (password && !password.length)
    )
      return res.status(400).send({ error: "Invalid Credentials" });
    const result = await login({ username, password });
    return result.error ? res.status(400).send(error) : res.send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
