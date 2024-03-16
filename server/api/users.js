const express = require("express");
const userRouter = express.Router();
const verifyToken = require("../middleware.js");
const { login, register, editUser, getUserInfo } = require("../../db/index.js");

userRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || !username.length || !password.length)
      return res.status(400).send({ error: "Invalid Credentials" });
    const result = await login({ username, password });
    return result.error ? res.status(400).send(result) : res.send(result);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const { firstname, lastname, address, username, ssn, password } = req.body;
    if (
      !firstname ||
      !lastname ||
      !address ||
      !username ||
      !firstname.length ||
      !lastname.length ||
      !address.length ||
      !username.length
    )
      return res.status(400).send({ error: "All fields are required" });
    if (!ssn || ssn.length !== 9)
      return res.status(400).send({ error: "SSN must be 9 digits" });
    if (
      !username ||
      (username && (username.length > 20 || username.length < 3))
    )
      return res
        .status(400)
        .send({ error: "Username must be between 3 and 20 characters" });
    if (!password || password.length < 8)
      return res
        .status(400)
        .send({ error: "Password must be at least 8 characters" });
    const result = await register({
      firstname,
      lastname,
      address,
      username,
      ssn,
      password,
    });
    return result.error ? res.status(400).send(result) : res.send(result);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/edit", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid Credentials" });
    const { user_id } = req.user;
    const { firstname, lastname, address, password } = req.body;
    if (password && password.length < 8)
      return res
        .status(400)
        .send({ error: "Password must be at least 8 characters" });
    const data = {};
    data.firstname = firstname || null;
    data.lastname = lastname || null;
    data.address = address || null;
    data.password = password || null;
    return res.send(await editUser({ ...data, user_id }));
  } catch (error) {
    next(error);
  }
});

userRouter.post("/get", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid Credentials" });
    const { user_id } = req.user;
    const { username } = req.body;
    if (!username)
      return res.status(400).send({ error: "Username is required" });
    const result = await getUserInfo(username, user_id);
    return result.error ? res.status(400).send(result) : res.send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
