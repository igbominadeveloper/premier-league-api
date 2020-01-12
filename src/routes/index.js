import { Router } from 'express';

import authRouter from './auth';
import teamRouter from './team';

const router = Router();

router.get('/', (req, res) =>
  res.json({
    status: 'success',
    message: 'Welcome to Premier League API V1',
  }),
);

router.use('/auth', authRouter);
router.use('/teams', teamRouter);

export default router;
