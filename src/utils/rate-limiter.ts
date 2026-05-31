import {RateLimiterMemory} from 'rate-limiter-flexible';

export const rateLimiter = new RateLimiterMemory({
  points: process.env.RATE_LIMIT_POINTS ? parseInt(process.env.RATE_LIMIT_POINTS) : 1, // Number of points
  duration: process.env.RATE_LIMIT_DURATION ? parseInt(process.env.RATE_LIMIT_DURATION) : 30, // Per second(s)
});