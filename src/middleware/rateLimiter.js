const {rateLimit} = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');
const redisClient = require('../utils/redisClient');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10000,
    message: "Too many requests, please try again later...",
    store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

module.exports = limiter;