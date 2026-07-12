import { Router } from 'express';
import * as ctrl from './fuel-expenses.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const fuelLogSchema = z.object({
  vehicleId: z.string().uuid(),
  liters: z.number().positive(),
  cost: z.number().positive(),
  date: z.string().optional(),
});

const expenseSchema = z.object({
  vehicleId: z.string().uuid(),
  category: z.enum(['TOLL', 'MAINTENANCE', 'OTHER']),
  amount: z.number().positive(),
  notes: z.string().optional(),
  date: z.string().optional(),
});

router.use(authenticate);

// Fuel logs
router.get('/fuel-logs', ctrl.getAllFuelLogs);
router.post('/fuel-logs', requireRole(['DRIVER', 'FLEET_MANAGER']), validate(fuelLogSchema), ctrl.createFuelLog);

// Expenses
router.get('/expenses', ctrl.getAllExpenses);
router.post('/expenses', requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']), validate(expenseSchema), ctrl.createExpense);

export default router;
