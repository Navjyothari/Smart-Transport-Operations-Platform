import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { Prisma, VehicleStatus } from '@prisma/client';

export async function getAllVehicles(query: {
  status?: string;
  type?: string;
  region?: string;
  availableForDispatch?: string;
}) {
  const where: Prisma.VehicleWhereInput = {};

  if (query.availableForDispatch === 'true') {
    where.status = VehicleStatus.AVAILABLE;
  } else if (query.status) {
    where.status = query.status as VehicleStatus;
  }

  if (query.type) where.type = query.type;
  if (query.region) where.region = query.region;

  return prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getVehicleById(id: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      trips: { orderBy: { createdAt: 'desc' }, take: 10 },
      maintenanceLogs: { orderBy: { openedAt: 'desc' }, take: 5 },
      fuelLogs: { orderBy: { date: 'desc' }, take: 10 },
      expenses: { orderBy: { date: 'desc' }, take: 10 },
    },
  });
  if (!vehicle) throw new AppError('Vehicle not found', 404);
  return vehicle;
}

export async function createVehicle(data: {
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacityKg: number;
  odometer?: number;
  acquisitionCost: number;
  region?: string;
}) {
  // Check uniqueness manually for a friendlier error
  const existing = await prisma.vehicle.findUnique({
    where: { registrationNumber: data.registrationNumber },
  });
  if (existing) {
    throw new AppError(`Vehicle with registration number '${data.registrationNumber}' already exists`, 409);
  }

  return prisma.vehicle.create({ data });
}

export async function updateVehicle(id: string, data: Partial<{
  name: string;
  type: string;
  maxLoadCapacityKg: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region: string;
}>) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  return prisma.vehicle.update({ where: { id }, data });
}

export async function deleteVehicle(id: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  return prisma.vehicle.delete({ where: { id } });
}
