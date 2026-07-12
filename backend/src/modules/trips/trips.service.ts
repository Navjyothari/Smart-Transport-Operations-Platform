import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { TripStatus, VehicleStatus, DriverStatus } from '@prisma/client';

export async function getAllTrips(query: { status?: string }) {
  const where: { status?: TripStatus } = {};
  if (query.status) where.status = query.status as TripStatus;

  return prisma.trip.findMany({
    where,
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      driver: { select: { id: true, name: true, licenseNumber: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTripById(id: string) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: true,
    },
  });
  if (!trip) throw new AppError('Trip not found', 404);
  return trip;
}

export async function createTrip(data: {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  revenue?: number;
}) {
  // Rule checks are also done on dispatch; here just create as DRAFT
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  const driver = await prisma.driver.findUnique({ where: { id: data.driverId } });
  if (!driver) throw new AppError('Driver not found', 404);

  // Warn if weight exceeds capacity even at DRAFT stage
  if (data.cargoWeightKg > vehicle.maxLoadCapacityKg) {
    throw new AppError(
      `Cargo weight (${data.cargoWeightKg}kg) exceeds vehicle max load capacity (${vehicle.maxLoadCapacityKg}kg)`,
      422
    );
  }

  return prisma.trip.create({
    data: {
      ...data,
      status: TripStatus.DRAFT,
    },
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      driver: { select: { id: true, name: true, licenseNumber: true } },
    },
  });
}

export async function dispatchTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { vehicle: true, driver: true },
  });

  if (!trip) throw new AppError('Trip not found', 404);
  if (trip.status !== TripStatus.DRAFT) {
    throw new AppError(`Trip cannot be dispatched — current status is ${trip.status}`, 400);
  }

  // ── Business Rules (enforced in order per spec) ─────────────────────────

  // Rule 1: vehicle must be AVAILABLE
  if (trip.vehicle.status !== VehicleStatus.AVAILABLE) {
    throw new AppError(
      `Vehicle '${trip.vehicle.registrationNumber}' is not available (status: ${trip.vehicle.status})`,
      422
    );
  }

  // Rule 2: driver must be AVAILABLE
  if (trip.driver.status === DriverStatus.SUSPENDED) {
    throw new AppError(
      `Driver '${trip.driver.name}' is suspended and cannot be assigned to trips`,
      422
    );
  }
  if (trip.driver.status !== DriverStatus.AVAILABLE) {
    throw new AppError(
      `Driver '${trip.driver.name}' is not available (status: ${trip.driver.status})`,
      422
    );
  }

  // Rule 3: driver license not expired
  const now = new Date();
  if (trip.driver.licenseExpiryDate < now) {
    throw new AppError(
      `Driver '${trip.driver.name}' has an expired license (expired: ${trip.driver.licenseExpiryDate.toDateString()})`,
      422
    );
  }

  // Rule 4: cargo weight <= vehicle max load capacity
  if (trip.cargoWeightKg > trip.vehicle.maxLoadCapacityKg) {
    throw new AppError(
      `Cargo weight (${trip.cargoWeightKg}kg) exceeds vehicle max load capacity (${trip.vehicle.maxLoadCapacityKg}kg)`,
      422
    );
  }

  // ── Transactional update ─────────────────────────────────────────────────
  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.DISPATCHED, dispatchedAt: now },
      include: {
        vehicle: { select: { id: true, name: true, registrationNumber: true } },
        driver: { select: { id: true, name: true, licenseNumber: true } },
      },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: VehicleStatus.ON_TRIP },
    }),
    prisma.driver.update({
      where: { id: trip.driverId },
      data: { status: DriverStatus.ON_TRIP },
    }),
  ]);

  return updatedTrip;
}

export async function completeTrip(tripId: string, data: {
  actualDistanceKm?: number;
  fuelConsumedL?: number;
  revenue?: number;
}) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { vehicle: true, driver: true },
  });

  if (!trip) throw new AppError('Trip not found', 404);
  if (trip.status !== TripStatus.DISPATCHED) {
    throw new AppError(`Trip cannot be completed — current status is ${trip.status}`, 400);
  }

  const now = new Date();

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.COMPLETED,
        completedAt: now,
        ...(data.actualDistanceKm !== undefined && { actualDistanceKm: data.actualDistanceKm }),
        ...(data.fuelConsumedL !== undefined && { fuelConsumedL: data.fuelConsumedL }),
        ...(data.revenue !== undefined && { revenue: data.revenue }),
      },
      include: {
        vehicle: { select: { id: true, name: true, registrationNumber: true } },
        driver: { select: { id: true, name: true, licenseNumber: true } },
      },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data: {
        status: VehicleStatus.AVAILABLE,
        ...(data.actualDistanceKm !== undefined && {
          odometer: { increment: data.actualDistanceKm },
        }),
      },
    }),
    prisma.driver.update({
      where: { id: trip.driverId },
      data: { status: DriverStatus.AVAILABLE },
    }),
  ]);

  return updatedTrip;
}

export async function cancelTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { vehicle: true, driver: true },
  });

  if (!trip) throw new AppError('Trip not found', 404);
  if (trip.status !== TripStatus.DISPATCHED && trip.status !== TripStatus.DRAFT) {
    throw new AppError(`Trip cannot be cancelled — current status is ${trip.status}`, 400);
  }

  const now = new Date();
  const wasDispatched = trip.status === TripStatus.DISPATCHED;

  const updates: any[] = [
    prisma.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.CANCELLED, cancelledAt: now },
      include: {
        vehicle: { select: { id: true, name: true, registrationNumber: true } },
        driver: { select: { id: true, name: true, licenseNumber: true } },
      },
    }),
  ];

  // Only restore vehicle/driver status if the trip was dispatched
  if (wasDispatched) {
    updates.push(
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      })
    );
    updates.push(
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      })
    );
  }

  const [updatedTrip] = await prisma.$transaction(updates);
  return updatedTrip;
}
