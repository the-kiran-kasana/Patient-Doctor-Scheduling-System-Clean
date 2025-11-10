const Queue = require("bull");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const reminderQueue = new Queue("reminderQueue", redisUrl);


module.exports = { reminderQueue };