import { Request, Response, NextFunction } from 'express';
import * as service from './driver-requests.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { RequestStatus } from '@prisma/client';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const request = await service.createRequest({
      name: req.body.name,
      licenseNumber: req.body.licenseNumber,
      licenseCategory: req.body.licenseCategory,
      licenseExpiryDate: new Date(req.body.licenseExpiryDate),
      contactNumber: req.body.contactNumber,
      email: req.body.email,
    });
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status ? (req.query.status as RequestStatus) : undefined;
    const requests = await service.getRequests(status);
    res.json(requests);
  } catch (err) {
    next(err);
  }
}

export async function approve(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviewedByUserId = req.user?.userId || 'unknown';
    const newDriver = await service.approveRequest(req.params.id as string, reviewedByUserId);
    res.json(newDriver);
  } catch (err) {
    next(err);
  }
}

export async function reject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviewedByUserId = req.user?.userId || 'unknown';
    const { rejectionReason } = req.body;
    const request = await service.rejectRequest(req.params.id as string, reviewedByUserId, rejectionReason);
    res.json(request);
  } catch (err) {
    next(err);
  }
}
