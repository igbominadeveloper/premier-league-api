import { Router } from 'express';

import * as actions from './controllers/team';
import validateRequest from './middlewares/validate-input';
import {
  createTeamSchema,
  updateTeamSchema,
  teamIdSchema,
} from './middlewares/joi-schema';
import { checkTokenValidity } from './middlewares/checkTokenValidity';
import verifyAdminUser from './middlewares/checkIfUserIsAdmin';

const router = Router();

router.post(
  '/',
  validateRequest(createTeamSchema, 'body'),
  checkTokenValidity,
  verifyAdminUser,
  actions.create,
);

router.get('/', checkTokenValidity, actions.all);

router.patch(
  '/:teamId',
  validateRequest(updateTeamSchema, 'body'),
  validateRequest(teamIdSchema, 'params'),
  checkTokenValidity,
  verifyAdminUser,
  actions.update,
);

router.get(
  '/:teamId',
  validateRequest(teamIdSchema, 'params'),
  checkTokenValidity,
  actions.find,
);

router.delete(
  '/:teamId',
  validateRequest(teamIdSchema, 'params'),
  checkTokenValidity,
  verifyAdminUser,
  actions.deleteOne,
);

export default router;
