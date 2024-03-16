const express = require("express");
const accountRouter = express.Router();
const verifyToken = require("../middleware.js");
const {
  addAccount,
  deposit,
  withdrawal,
  transfer,
} = require("../../db/index.js");

accountRouter.post("/add", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid Credentials" });
    const { user_id } = req.user;
    const { type } = req.body;
    const val = type === "savings";
    return res.send(await addAccount(user_id, val));
  } catch (error) {
    next(error);
  }
});

accountRouter.put("/deposit", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid Credentials" });
    const { amount, account_id } = req.body;
    if (!amount || Number(amount) < 0)
      return res.status(400).send({ error: "Amount cannot be less than 0" });
    const result = await deposit(amount, account_id);
    return result.error ? res.status(400).send(result) : res.send(result);
  } catch (error) {
    next(error);
  }
});
accountRouter.put("/withdrawal", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid Credentials" });
    const { amount, account_id } = req.body;
    if (!amount || Number(amount) < 0)
      return res.status(400).send({ error: "Amount cannot be less than 0" });
    const result = await withdrawal(amount, account_id);
    return result.error ? res.status(400).send(result) : res.send(result);
  } catch (error) {
    next(error);
  }
});
accountRouter.put("/transfer", verifyToken, async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: "Invalid Credentials" });
    const { account_id, to_account_id, amount } = req.body;
    if (!amount || Number(amount) < 0)
      return res.status(400).send({ error: "Amount cannot be less than 0" });
    if (account_id === to_account_id)
      return res.status(400).send({ error: "Cannot transfer to same account" });
    const result = await transfer(amount, account_id, to_account_id);
    return result.error ? res.status(400).send(result) : res.send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = accountRouter;
