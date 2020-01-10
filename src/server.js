import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';

import router from './routes';

// Create global app object
const app = express();

app.use(cors());

// enable use of dotenv config file.
dotenv.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
    },
  }),
);

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

// API routes
app.use('/api/v1', router);

// Handling unavailable routes
app.all('*', (req, res) =>
  res.status(405).json({
    error: 'Method not allowed',
  }),
);

const port = process.env.PORT || 3000;
// finally, let's start our server...
app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
