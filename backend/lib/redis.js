const Redis = require("ioredis");
require("dotenv").config();
const redis = new Redis(process.env.UPSTASH_URL);

module.exports = redis;
