import { Request, Response, NextFunction } from 'express';
import * as tripsService from './trips.service';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trips = await tripsService.getAllTrips(req.query as Record<string, string>);
    res.json(trips);
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripsService.getTripById(req.params.id as string);
    res.json(trip);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripsService.createTrip(req.body);
    res.status(201).json(trip);
  } catch (err) { next(err); }
}

export async function dispatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripsService.dispatchTrip(req.params.id as string);
    res.json(trip);
  } catch (err) { next(err); }
}

export async function complete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripsService.completeTrip(req.params.id as string, req.body);
    res.json(trip);
  } catch (err) { next(err); }
}

export async function cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await tripsService.cancelTrip(req.params.id as string);
    res.json(trip);
  } catch (err) { next(err); }
}
