import { rateLimit } from 'express-rate-limit';

const standardRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "You have made too many requests in a short period of time. Please try again later.",
});

const strictRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "You have made too many requests in a short period of time. Please try again later.",
});

export { standardRateLimit, strictRateLimit };