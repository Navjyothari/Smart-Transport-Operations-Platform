import { Request, Response, NextFunction } from 'express';
import * as service from './fuel-expenses.service';

export async function getAllFuelLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logs = await service.getAllFuelLogs(req.query as Record<string, string>);
    res.json(logs);
  } catch (err) { next(err); }
}

export async function createFuelLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    const log = await service.createFuelLog(data);
    res.status(201).json(log);
  } catch (err) { next(err); }
}

export async function getAllExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const expenses = await service.getAllExpenses(req.query as Record<string, string>);
    res.json(expenses);
  } catch (err) { next(err); }
}

export async function createExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    const expense = await service.createExpense(data);
    res.status(201).json(expense);
  } catch (err) { next(err); }
}
