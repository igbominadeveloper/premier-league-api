import { Router } from 'express';

import * as actions from './controllers/team';
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
  actions.create,
);

router.get('/', checkTokenValidity, actions.all);

export default router;
