import { Router } from 'express';

import authRouter from './auth';
import teamRouter from './team';
import fixtureRouter from './fixture';
import searchRouter from './search';

const router = Router();

router.get('/', (req, res) =>
  res.json({
    status: 'success',
    message: 'Welcome to Premier League API V1',
  }),
);

router.use('/auth', authRouter);
router.use('/teams', teamRouter);
router.use('/fixtures', fixtureRouter);
router.use('/search', searchRouter);

export default router;
