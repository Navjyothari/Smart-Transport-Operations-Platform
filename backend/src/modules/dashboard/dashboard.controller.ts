import { Request, Response, NextFunction } from 'express';
import * as dashboardService from './dashboard.service';

export async function getKpis(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const kpis = await dashboardService.getKpis(req.query as Record<string, string>);
    res.json(kpis);
  } catch (err) { next(err); }
}
