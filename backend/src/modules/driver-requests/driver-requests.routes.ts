import { Router } from 'express';
import * as ctrl from './driver-requests.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseCategory: z.string().min(1, 'License category is required'),
  licenseExpiryDate: z.string().min(1, 'License expiry date is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Valid email is required'),
});

const rejectSchema = z.object({
  rejectionReason: z.string().optional(),
});

// 1. PUBLIC: Apply as a driver
router.post('/', validate(createSchema), ctrl.create);

// 2. PROTECTED: Manage driver requests
router.use(authenticate);
router.use(requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']));

router.get('/', ctrl.getAll);
router.post('/:id/approve', ctrl.approve);
router.post('/:id/reject', validate(rejectSchema), ctrl.reject);

export default router;
