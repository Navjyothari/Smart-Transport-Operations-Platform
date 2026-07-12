import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { MaintenanceStatus, VehicleStatus } from '@prisma/client';

export async function getAllMaintenance(query: { status?: string; vehicleId?: string }) {
  const where: { status?: MaintenanceStatus; vehicleId?: string } = {};
  if (query.status) where.status = query.status as MaintenanceStatus;
  if (query.vehicleId) where.vehicleId = query.vehicleId;

  return prisma.maintenanceLog.findMany({
    where,
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
    },
    orderBy: { openedAt: 'desc' },
  });
}

export async function createMaintenanceLog(data: {
  vehicleId: string;
  type: string;
  cost: number;
  notes?: string;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  if (vehicle.status === VehicleStatus.RETIRED) {
    throw new AppError('Cannot create maintenance record for a RETIRED vehicle', 422);
  }
  if (vehicle.status === VehicleStatus.IN_SHOP) {
    throw new AppError('Vehicle is already IN_SHOP', 422);
  }

  // Transactional: create maintenance log AND set vehicle status to IN_SHOP
  const [log] = await prisma.$transaction([
    prisma.maintenanceLog.create({
      data: { ...data, status: MaintenanceStatus.ACTIVE },
      include: {
        vehicle: { select: { id: true, name: true, registrationNumber: true } },
      },
    }),
    prisma.vehicle.update({
      where: { id: data.vehicleId },
      data: { status: VehicleStatus.IN_SHOP },
    }),
  ]);

  return log;
}

export async function closeMaintenanceLog(id: string) {
  const log = await prisma.maintenanceLog.findUnique({
    where: { id },
    include: { vehicle: true },
  });

  if (!log) throw new AppError('Maintenance log not found', 404);
  if (log.status === MaintenanceStatus.CLOSED) {
    throw new AppError('Maintenance log is already closed', 400);
  }

  const now = new Date();

  // Restore vehicle to AVAILABLE unless it's RETIRED
  const newVehicleStatus =
    log.vehicle.status === VehicleStatus.RETIRED
      ? VehicleStatus.RETIRED
      : VehicleStatus.AVAILABLE;

  const [updatedLog] = await prisma.$transaction([
    prisma.maintenanceLog.update({
      where: { id },
      data: { status: MaintenanceStatus.CLOSED, closedAt: now },
      include: {
        vehicle: { select: { id: true, name: true, registrationNumber: true } },
      },
    }),
    prisma.vehicle.update({
      where: { id: log.vehicleId },
      data: { status: newVehicleStatus },
    }),
  ]);

  return updatedLog;
}
