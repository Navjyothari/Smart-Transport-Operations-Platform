import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error & { statusCode?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error]', err.message);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    res.status(409).json({ error: 'Resource already exists (duplicate unique field)' });
    return;
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
}

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
