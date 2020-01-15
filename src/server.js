import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import router from './routes';
import dbconnect from './config/db';
import startRedisClient from './config/redis';

// Create global app object
const app = express();
app.use(cors());

// enable use of dotenv config file.
dotenv.config();

// enable morgan logs only in development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(express.json());

app.get('/', (req, res) =>
  res.status(200).json({
    message: 'Welcome to Mock premier league',
  }),
);

// start redis connection
startRedisClient();

// API routes
app.use('/api/v1', router);

// Handling unavailable routes
app.all('*', (req, res) =>
  res.status(405).json({
    error: 'Method not allowed',
  }),
);

// create and connect redis client to local instance.

const port = process.env.PORT || 5000;

// finally, let's start our server...
dbconnect()
  .then(async () => {
    if (!module.parent) {
      app.listen(port, () => {
        console.log(
          `Server running on ${process.env.NODE_ENV} environment, on port ${port}`,
        );
      });
    }
  })
  .catch(error => console.log(error.message));

export default app;
