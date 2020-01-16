/* istanbul ignore file */

import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const { REDIS_URL } = process.env;

const config = REDIS_URL || '';

export const getRedisClient = () => redis.createClient(config);

const startRedisClient = () => {
  // Print redis errors to the console
  getRedisClient().on('connect', () =>
    console.log('Redis server running at ' + getRedisClient().address),
  );

  getRedisClient().on('error', err => {
    console.log('Error ' + err);
  });

  process.on('exit', () => getRedisClient().quit());
};

export default startRedisClient;
