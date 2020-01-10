import { Router } from 'express';

const router = Router();

router.get('/', (req, res) =>
  res.json({
    status: 'success',
    message: 'Welcome to Premier League API V1',
  }),
);

export default router;
