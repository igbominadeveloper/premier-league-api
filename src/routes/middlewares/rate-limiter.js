/* istanbul ignore file */

import dotenv from 'dotenv';

import { getFromRedis, errorResponse, storeToRedis } from '../../utils/helpers';

dotenv.config();
const { MAX_REQUEST_COUNT_PER_MINUTE, MAX_WAIT_TIME } = process.env;

const storeNewValueToRedis = (key, value, timeout) =>
  storeToRedis(key, value, timeout);

const limiter = (req, res, next) => {
  // get the number of count from redis
  return getFromRedis(`count:${req.ip}`, result => {
    if (!result) {
      // set the count to 1 and call next
      storeNewValueToRedis(`count:${req.ip}`, 1, MAX_WAIT_TIME);
      return next();
    }

    // check if the count is more than the limit
    if (result >= MAX_REQUEST_COUNT_PER_MINUTE) {
      return errorResponse(
        res,
        429,
        `Too many requests, now you will have to rest for ${MAX_WAIT_TIME /
          60 /
          1000} minutes`,
      );
    }
    // increase the count by 1 and call next
    storeNewValueToRedis(`count:${req.ip}`, Number(result) + 1, MAX_WAIT_TIME);
    return next();
  });
};

export default limiter;
