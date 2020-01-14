import { Router } from 'express';

import * as actions from './controllers/search';
import validateRequest from './middlewares/validate-input';
import { searchSchema } from './middlewares/joi-schema';

const router = Router();

router.get('/', validateRequest(searchSchema, 'query'), actions.find);

export default router;
