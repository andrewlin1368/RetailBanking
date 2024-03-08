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

module.exports = { login };
