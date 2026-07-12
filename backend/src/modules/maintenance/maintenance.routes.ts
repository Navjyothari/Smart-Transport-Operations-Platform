import { Router } from 'express';
import * as ctrl from './maintenance.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.string().min(1),
  cost: z.number().min(0),
  notes: z.string().optional(),
});

router.use(authenticate);

router.get('/', ctrl.getAll);
router.post('/', requireRole(['FLEET_MANAGER']), validate(createSchema), ctrl.create);
router.post('/:id/close', requireRole(['FLEET_MANAGER']), ctrl.close);

export default router;
