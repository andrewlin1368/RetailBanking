const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const clearTables = async () => {
  try {
    console.log("clearing tables...");
    await prisma.transactions.deleteMany();
    await prisma.accounts.deleteMany();
    await prisma.users.deleteMany();
    console.log("tables cleared. resetting sequences...");
    await prisma.$executeRaw`alter sequence "transactions_transaction_id_seq" restart with 1`;
    await prisma.$executeRaw`alter sequence "accounts_account_id_seq" restart with 100000000`;
    await prisma.$executeRaw`alter sequence "users_user_id_seq" restart with 1`;
    console.log("sequences reset.");
  } catch (error) {
    console.error(error);
  }
};

const addUsers = async () => {
  try {
    console.log("adding users...");
    const salt = await bcrypt.genSalt(8);
    const hashPass = await bcrypt.hash("password", salt);
    const users = [
      {
        firstname: "andrew",
        lastname: "lin",
        address: "WHITE HOUSE 111",
        username: "andrew123",
        password: hashPass,
        isadmin: true,
        ssn: "123456789",
      },
      {
        firstname: "amy",
        lastname: "liu",
        address: "WHITE HOUSE 111",
        username: "amy123",
        password: hashPass,
        ssn: "123456780",
      },
    ];
    await prisma.users.createMany({
      data: users,
    });
    console.log("users added.");
  } catch (error) {
    console.error(error);
  }
};

const addAccounts = async () => {
  try {
    console.log("adding accounts...");
    const accounts = [
      {
        user_id: 1,
      },
      {
        user_id: 1,
        issavings: true,
      },
      {
        user_id: 1,
        issavings: true,
      },
      {
        user_id: 2,
      },
      {
        user_id: 2,
        issavings: true,
      },
    ];
    await prisma.accounts.createMany({
      data: accounts,
    });
    console.log("accounts added.");
  } catch (error) {
    console.error(error);
  }
};

const addTransactions = async () => {
  try {
    console.log("creating transactions...");
    const transactions = [
      {
        amount: 250,
        toaccount: 100000000,
        fromaccount: 100000000,
        trans_type: "deposit",
      },
      {
        amount: 10,
        toaccount: 100000000,
        fromaccount: 100000000,
        trans_type: "withdrawal",
      },
      {
        amount: 50000,
        toaccount: 100000001,
        fromaccount: 100000001,
        trans_type: "deposit",
      },
      {
        amount: 1000,
        toaccount: 100000002,
        fromaccount: 100000002,
        trans_type: "deposit",
      },
      {
        amount: 50,
        toaccount: 100000000,
        fromaccount: 100000002,
        trans_type: "transfer",
      },
    ];
    await prisma.transactions.createMany({
      data: transactions,
    });
    console.log("transactions created.");
    console.log("updating accounts balances...");
    await prisma.accounts.update({
      where: {
        account_id: 100000000,
      },
      data: {
        balance: 190,
      },
    });
    await prisma.accounts.update({
      where: {
        account_id: 100000001,
      },
      data: {
        balance: 50000,
      },
    });
    await prisma.accounts.update({
      where: {
        account_id: 100000002,
      },
      data: {
        balance: 1050,
      },
    });
    console.log("accounts updated");
  } catch (error) {
    console.error(error);
  }
};

const start = async () => {
  await clearTables();
  await addUsers();
  await addAccounts();
  await addTransactions();
};

start();
