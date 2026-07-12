import { Request, Response, NextFunction } from 'express';
import * as vehiclesService from './vehicles.service';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const vehicles = await vehiclesService.getAllVehicles(req.query as Record<string, string>);
    res.json(vehicles);
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const vehicle = await vehiclesService.getVehicleById(req.params.id as string);
    res.json(vehicle);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const vehicle = await vehiclesService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const vehicle = await vehiclesService.updateVehicle(req.params.id as string, req.body);
    res.json(vehicle);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await vehiclesService.deleteVehicle(req.params.id as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
