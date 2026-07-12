import { Router } from 'express';
import * as ctrl from './vehicles.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
  registrationNumber: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  maxLoadCapacityKg: z.number().positive(),
  odometer: z.number().min(0).optional(),
  acquisitionCost: z.number().positive(),
  region: z.string().optional(),
});

const updateSchema = createSchema.partial().extend({
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).optional(),
});

router.use(authenticate);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', requireRole(['FLEET_MANAGER']), validate(createSchema), ctrl.create);
router.patch('/:id', requireRole(['FLEET_MANAGER']), validate(updateSchema), ctrl.update);
router.delete('/:id', requireRole(['FLEET_MANAGER']), ctrl.remove);

export default router;
