import { Router } from 'express';

import { signup } from './controllers/auth';
import validateRequest from './middlewares/validate-input';
import { signupSchema } from './middlewares/joi-schema';

const router = Router();

router.post('/signup', validateRequest(signupSchema, 'body'), signup);

export default router;
