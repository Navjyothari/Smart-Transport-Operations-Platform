import { Router } from 'express';
import * as ctrl from './reports.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/fuel-efficiency', ctrl.getFuelEfficiency);
router.get('/fleet-utilization', ctrl.getFleetUtilization);
router.get('/operational-cost', ctrl.getOperationalCost);
router.get('/vehicle-roi', ctrl.getVehicleROI);
router.get('/export.csv', ctrl.exportCsv);

export default router;
