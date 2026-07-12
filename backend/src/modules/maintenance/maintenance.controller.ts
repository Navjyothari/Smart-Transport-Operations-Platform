import { Request, Response, NextFunction } from 'express';
import * as maintenanceService from './maintenance.service';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logs = await maintenanceService.getAllMaintenance(req.query as Record<string, string>);
    res.json(logs);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const log = await maintenanceService.createMaintenanceLog(req.body);
    res.status(201).json(log);
  } catch (err) { next(err); }
}

export async function close(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const log = await maintenanceService.closeMaintenanceLog(req.params.id as string);
    res.json(log);
  } catch (err) { next(err); }
}
