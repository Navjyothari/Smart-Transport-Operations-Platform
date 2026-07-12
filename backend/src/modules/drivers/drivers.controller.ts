import { Request, Response, NextFunction } from 'express';
import * as driversService from './drivers.service';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const drivers = await driversService.getAllDrivers(req.query as Record<string, string>);
    res.json(drivers);
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const driver = await driversService.getDriverById(req.params.id as string);
    res.json(driver);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const driver = await driversService.createDriver({
      ...req.body,
      licenseExpiryDate: new Date(req.body.licenseExpiryDate),
    });
    res.status(201).json(driver);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = { ...req.body };
    if (data.licenseExpiryDate) data.licenseExpiryDate = new Date(data.licenseExpiryDate);
    const driver = await driversService.updateDriver(req.params.id as string, data);
    res.json(driver);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await driversService.deleteDriver(req.params.id as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
