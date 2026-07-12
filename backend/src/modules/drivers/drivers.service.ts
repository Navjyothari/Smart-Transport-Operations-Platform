import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { Prisma, DriverStatus } from '@prisma/client';

export async function getAllDrivers(query: {
  status?: string;
  availableForDispatch?: string;
}) {
  const where: Prisma.DriverWhereInput = {};

  if (query.availableForDispatch === 'true') {
    where.status = DriverStatus.AVAILABLE;
  } else if (query.status) {
    where.status = query.status as DriverStatus;
  }

  return prisma.driver.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDriverById(id: string) {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: {
      trips: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
  if (!driver) throw new AppError('Driver not found', 404);
  return driver;
}

export async function createDriver(data: {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: Date;
  contactNumber: string;
  safetyScore?: number;
}) {
  const existing = await prisma.driver.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });
  if (existing) {
    throw new AppError(`Driver with license number '${data.licenseNumber}' already exists`, 409);
  }

  return prisma.driver.create({ data });
}

export async function updateDriver(id: string, data: Partial<{
  name: string;
  licenseCategory: string;
  licenseExpiryDate: Date;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}>) {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) throw new AppError('Driver not found', 404);

  return prisma.driver.update({ where: { id }, data });
}

export async function deleteDriver(id: string) {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) throw new AppError('Driver not found', 404);

  return prisma.driver.delete({ where: { id } });
}
