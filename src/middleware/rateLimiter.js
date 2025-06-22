const {rateLimit} = require('express-limit-rate');
const {RedisStore} = require('rate-limit-redis');
const redisClient = require('../utils/redisClient');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later...",
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    })
});

module.exports = limiter;