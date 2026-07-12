import { Router } from 'express';
import { getKpis } from './dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/kpis', getKpis);

export default router;
