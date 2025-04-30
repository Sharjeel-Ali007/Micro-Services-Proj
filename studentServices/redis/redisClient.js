const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient();

redisClient.connect().catch(console.error);

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redisClient;
