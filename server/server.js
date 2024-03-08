const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const accountRouter = require("./api/accounts.js");
const userRouter = require("./api/users.js");

const server = express();
dotenv.config();
const PORT = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/user", userRouter);
server.use("/account", accountRouter);

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
