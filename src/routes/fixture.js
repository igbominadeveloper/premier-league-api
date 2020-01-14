import { Router } from 'express';

import Fixture from '../db/models/Fixture';
import * as actions from './controllers/fixture';

import validateRequest from './middlewares/validate-input';
import {
  createFixtureSchema,
  fixtureIdSchema,
  updateFixtureSchema,
} from './middlewares/joi-schema';
import { checkTokenValidity } from './middlewares/checkTokenValidity';
import verifyAdminUser from './middlewares/checkIfUserIsAdmin';
import { checkResourceOwner } from './middlewares/checkResourceOwner';

const router = Router();

router.post(
  '/',
  validateRequest(createFixtureSchema, 'body'),
  checkTokenValidity,
  verifyAdminUser,
  actions.create,
);

router.get('/', checkTokenValidity, actions.all);

router.get(
  '/:fixtureId',
  validateRequest(fixtureIdSchema, 'params'),
  checkTokenValidity,
  actions.find,
);

router.patch(
  '/:fixtureId',
  validateRequest(updateFixtureSchema, 'body'),
  validateRequest(fixtureIdSchema, 'params'),
  checkTokenValidity,
  verifyAdminUser,
  checkResourceOwner(Fixture, 'fixtureId'),
  actions.update,
);

export default router;
