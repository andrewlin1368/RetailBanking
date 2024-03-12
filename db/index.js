const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ERROR = { error: "Invalid Credentials" };

const login = async ({ username, password }) => {
  const user = await prisma.users.findFirst({ where: { username } });
  if (!user) return ERROR;
  const checkPass = await bcrypt.compare(password, user.password);
  if (!checkPass) return ERROR;
  delete user.password;
  const accounts = await prisma.accounts.findMany({
    where: { user_id: user.user_id },
    orderBy: { account_id: "asc" },
  });
  const _accounts = [];
  for (let account of accounts) {
    _accounts.push({
      ...account,
      transactions: await prisma.transactions.findMany({
        where: { account_id: account.account_id },
        orderBy: { created_at: "desc" },
      }),
    });
  }
  const token = jwt.sign({ user_id: user.user_id }, process.env.JWT);
  return { user, accounts: _accounts, token };
};
const register = async ({
  firstname,
  lastname,
  address,
  ssn,
  username,
  password,
}) => {
  let user = await prisma.users.findFirst({ where: { username } });
  if (user) return { error: "Invalid Username" };
  user = await prisma.users.findFirst({ where: { ssn } });
  if (user) return { error: "Invalid SSN" };
  const salt = await bcrypt.genSalt(8);
  const hashPass = await bcrypt.hash(password, salt);
  user = await prisma.users.create({
    data: {
      firstname,
      lastname,
      address,
      ssn,
      username,
      password: hashPass,
    },
  });
  const token = jwt.sign({ user_ud: user.user_id }, process.env.JWT);
  return { user, accounts: [], token };
};
const editUser = async ({
  user_id,
  firstname,
  lastname,
  address,
  password,
}) => {
  let hashPass;
  const data = {};
  if (password) {
    const salt = await bcrypt.genSalt(8);
    hashPass = await bcrypt.hash(password, salt);
    data.password = hashPass;
  }
  if (firstname) data.firstname = firstname;
  if (lastname) data.lastname = lastname;
  if (address) data.address = address;
  const user = await prisma.users.update({
    where: { user_id },
    data,
  });
  delete user.password;
  return { user };
};
const getUserInfo = async (username, user_id) => {
  const admin = await prisma.users.findFirst({ where: { user_id } });
  if (!admin.isadmin) return { error: "Invalid Credentials" };
  const user = await prisma.users.findFirst({ where: { username } });
  if (!user) return { error: "User not found" };
  delete user.password;
  const accounts = await prisma.accounts.findMany({
    where: { user_id: user.user_id },
    orderBy: { account_id: "asc" },
  });
  const _accounts = [];
  for (let account of accounts) {
    _accounts.push({
      ...account,
      transactions: await prisma.transactions.findMany({
        where: { account_id: account.account_id },
        orderBy: { created_at: "desc" },
      }),
    });
  }
  return { user, accounts: _accounts };
};
const addAccount = async (user_id, val) => {
  const account = await prisma.accounts.create({
    data: {
      user_id,
      issavings: val,
    },
  });
  return { account, transactions: [] };
};
const deposit = async (amount, account_id) => {
  let account = await prisma.accounts.findFirst({ where: { account_id } });
  if (!account) return { error: "Account does not exist" };
  account = await prisma.accounts.update({
    where: { account_id },
    data: {
      balance: Number(account.balance) + Number(amount),
    },
  });
  const transaction = await prisma.transactions.create({
    data: {
      amount,
      fromaccount: account_id,
      toaccount: account_id,
      trans_type: "deposit",
      account_id,
    },
  });
  return { account, transaction };
};
const withdrawal = async (amount, account_id) => {
  let account = await prisma.accounts.findFirst({ where: { account_id } });
  if (!account) return { error: "Account does not exist" };
  if (Number(account.balance) < Number(amount))
    return { error: "Insufficient funds" };
  account = await prisma.accounts.update({
    where: { account_id },
    data: { balance: Number(account.balance) - Number(amount) },
  });
  const transaction = await prisma.transactions.create({
    data: {
      amount,
      fromaccount: account_id,
      toaccount: account_id,
      trans_type: "withdrawal",
      account_id,
    },
  });
  return { account, transaction };
};
const transfer = async (amount, account_id, to_account_id) => {
  let to_account = await prisma.accounts.findFirst({
    where: { account_id: to_account_id },
  });
  if (!to_account) return { error: "Account does not exist" };
  let account = await prisma.accounts.findFirst({ where: { account_id } });
  if (!account) return { error: "Account does not exist" };
  if (Number(account.balance) < Number(amount))
    return { error: "Insufficient funds" };
  account = await prisma.accounts.update({
    where: { account_id },
    data: { balance: Number(account.balance) - Number(amount) },
  });
  const transaction = await prisma.transactions.create({
    data: {
      amount,
      fromaccount: account_id,
      toaccount: to_account_id,
      trans_type: "transfer",
      account_id,
    },
  });
  to_account = await prisma.accounts.update({
    where: { account_id: to_account_id },
    data: { balance: Number(to_account.balance) + Number(amount) },
  });
  const to_transaction = await prisma.transactions.create({
    data: {
      amount,
      fromaccount: account_id,
      toaccount: to_account_id,
      trans_type: "transfer",
      account_id: to_account_id,
    },
  });
  let data = { account, transaction };
  if (to_account.user_id === account.user_id)
    data = { ...data, to_account, to_transaction };
  return data;
};
module.exports = {
  login,
  register,
  editUser,
  addAccount,
  withdrawal,
  deposit,
  transfer,
  getUserInfo,
};
