const { PrismaClient } = require("@prisma/client");
const { Client } = require("pg");
const asyncHandler = require("express-async-handler");

const { user, transactionLog, billingAddress } = new PrismaClient();

const getChatHistory = asyncHandler(async (req, res) => {
  const chatId = parseInt(req.params.id);

  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const result = await client.query(
    'SELECT "messageId", "chatId", "senderId", "message", "sendDate", "profilePhoto" FROM "chatHistory" INNER JOIN "user" ON "user"."userId"="chatHistory"."senderId" WHERE "chatId"=$1 ORDER BY "messageId"',
    [chatId]
  );

  await client.end();

  res.json(result.rows);
});

const getSubscribeCreators = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);

  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const result = await client.query(
    'SELECT DISTINCT ON ("creatorId") "creatorId", "user"."name", "user"."profilePhoto", "sendDate" FROM "userSubscribe" INNER JOIN "user" ON "userId"="creatorId" LEFT JOIN "chatHistory" ON "creatorId"="chatId" WHERE "followerId"=$1 OR "creatorId"=$1',
    [userId]
  );

  await client.end();

  res.json(result.rows);
});

module.exports = {
  getChatHistory,
  getSubscribeCreators,
};
