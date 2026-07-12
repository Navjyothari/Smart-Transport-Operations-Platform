import { Router } from 'express';
import * as ctrl from './drivers.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1),
  licenseNumber: z.string().min(1),
  licenseCategory: z.string().min(1),
  licenseExpiryDate: z.string().min(1),
  contactNumber: z.string().min(1),
  safetyScore: z.number().min(0).max(100).optional(),
});

const updateSchema = createSchema.partial().extend({
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']).optional(),
});

router.use(authenticate);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), validate(createSchema), ctrl.create);
router.patch('/:id', requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), validate(updateSchema), ctrl.update);
router.delete('/:id', requireRole(['FLEET_MANAGER']), ctrl.remove);

export default router;
