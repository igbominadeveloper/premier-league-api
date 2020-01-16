/* istanbul ignore file */

import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const { REDIS_URL } = process.env;

const config = REDIS_URL || '';

const redisClient = new Redis(config);

const {
  options: { host, port },
} = redisClient;

// Print redis errors to the console
redisClient.on('connect', () =>
  console.log('Redis server running at ' + host + ':' + port),
);

redisClient.on('error', err => {
  console.log('Error ' + err);
});

process.on('exit', () => redisClient.quit());

export default redisClient;
