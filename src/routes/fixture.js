import { Router } from 'express';

import * as actions from './controllers/fixture';
import validateRequest from './middlewares/validate-input';
import { createFixtureSchema } from './middlewares/joi-schema';
import { checkTokenValidity } from './middlewares/checkTokenValidity';
import verifyAdminUser from './middlewares/checkIfUserIsAdmin';

const router = Router();

router.post(
  '/',
  validateRequest(createFixtureSchema, 'body'),
  checkTokenValidity,
  verifyAdminUser,
  actions.create,
);

export default router;
