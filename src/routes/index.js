import { Router } from 'express';

import authRouter from './auth';

const router = Router();

router.get('/', (req, res) =>
  res.json({
    status: 'success',
    message: 'Welcome to Premier League API V1',
  }),
);

router.use('/auth', authRouter);

export default router;
