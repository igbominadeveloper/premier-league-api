import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import dotenv from 'dotenv';

import { getRedisClient } from '../../config/redis';

dotenv.config();

const { MAX_REQUEST_COUNT_PER_MINUTE, MAX_WAIT_TIME } = process.env;

const limiter = new RateLimit({
  store: new RedisStore({
    client: getRedisClient(),
  }),
  max: MAX_REQUEST_COUNT_PER_MINUTE || 10, // limit each IP to 100 requests per windowMs
  windowMs: MAX_WAIT_TIME || 1000 * 60 * 10, // Wait time after exceeding max request count - ms
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  message: `You sent too many requests, now, you have to wait for ${MAX_WAIT_TIME /
    (1000 * 60)} minutes`,
});

export default limiter;
