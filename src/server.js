/* istanbul ignore file */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import connectRedis from 'connect-redis';

import router from './routes';
import dbconnect from './config/db';
import redisClient from './config/redis';
import limiter from './routes/middlewares/rate-limiter';

// Create global app object
const app = express();
app.use(cors());

// enable use of dotenv config file.
dotenv.config();

const { NODE_ENV, PORT, SECRET_KEY } = process.env;

// enable morgan logs only in development environment
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(express.json());

const redisStore = connectRedis(session);

if (NODE_ENV !== 'test') {
  app.use(
    session({
      secret: SECRET_KEY,
      store: new redisStore({
        client: redisClient,
      }),
      saveUninitialized: false,
      resave: false,
    }),
  );

  // apply rate limiter to every request
  app.use(limiter);
}

app.get('/', (req, res) =>
  res.status(200).json({
    message: 'Welcome to Mock premier league',
  }),
);

// API routes
app.use('/api/v1', router);

// Handling unavailable routes
app.all('*', (req, res) =>
  res.status(405).json({
    error: 'Method not allowed',
  }),
);

// create and connect redis client to local instance.

const port = PORT || 5000;

// finally, let's start our server...
dbconnect()
  .then(async () => {
    if (!module.parent) {
      app.listen(port, () => {
        console.log(
          `Server running on ${NODE_ENV} environment, on port ${port}`,
        );
      });
    }
  })
  .catch(error => console.log(error.message));

export default app;
