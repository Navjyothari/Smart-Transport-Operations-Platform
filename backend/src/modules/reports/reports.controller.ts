import { Request, Response, NextFunction } from 'express';
import * as reportsService from './reports.service';

export async function getFuelEfficiency(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await reportsService.getFuelEfficiency(req.query.vehicleId as string | undefined);
    res.json(data);
  } catch (err) { next(err); }
}

export async function getFleetUtilization(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await reportsService.getFleetUtilization();
    res.json(data);
  } catch (err) { next(err); }
}

export async function getOperationalCost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await reportsService.getOperationalCost(req.query.vehicleId as string | undefined);
    res.json(data);
  } catch (err) { next(err); }
}

export async function getVehicleROI(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await reportsService.getVehicleROI(req.query.vehicleId as string | undefined);
    res.json(data);
  } catch (err) { next(err); }
}

export async function exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const type = (req.query.type as string) || 'vehicles';
    const { csv, filename } = await reportsService.exportCsv(type);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) { next(err); }
}
