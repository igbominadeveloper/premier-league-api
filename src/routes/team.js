import { Router } from 'express';

import { create } from './controllers/team';
import validateRequest from './middlewares/validate-input';
import { teamSchema } from './middlewares/joi-schema';
import { checkTokenValidity } from './middlewares/checkTokenValidity';
import verifyAdminUser from './middlewares/checkIfUserIsAdmin';

const router = Router();

router.post(
  '/',
  validateRequest(teamSchema, 'body'),
  checkTokenValidity,
  verifyAdminUser,
  create,
);

export default router;
