import { Router } from 'express';
import * as ctrl from './trips.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid(),
  cargoWeightKg: z.number().positive(),
  plannedDistanceKm: z.number().positive(),
  revenue: z.number().min(0).optional(),
});

const completeSchema = z.object({
  actualDistanceKm: z.number().positive().optional(),
  fuelConsumedL: z.number().positive().optional(),
  revenue: z.number().min(0).optional(),
}).optional();

router.use(authenticate);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', requireRole(['DRIVER', 'FLEET_MANAGER']), validate(createSchema), ctrl.create);
router.post('/:id/dispatch', requireRole(['DRIVER', 'FLEET_MANAGER']), ctrl.dispatch);
router.post('/:id/complete', requireRole(['DRIVER', 'FLEET_MANAGER']), ctrl.complete);
router.post('/:id/cancel', requireRole(['DRIVER', 'FLEET_MANAGER']), ctrl.cancel);

export default router;
