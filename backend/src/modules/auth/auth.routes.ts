import { Router } from 'express';
import { login, me } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
