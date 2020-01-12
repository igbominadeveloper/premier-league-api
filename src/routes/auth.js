import { Router } from 'express';

import { signup, login } from './controllers/auth';
import validateRequest from './middlewares/validate-input';
import { signupSchema, loginSchema } from './middlewares/joi-schema';

const router = Router();

router.post('/signup', validateRequest(signupSchema, 'body'), signup);
router.post('/login', validateRequest(loginSchema, 'body'), login);

export default router;
