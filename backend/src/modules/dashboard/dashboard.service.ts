import prisma from '../../lib/prisma';
import { VehicleStatus, TripStatus, DriverStatus } from '@prisma/client';
import { calcFleetUtilization } from '../../utils/calculations';

export async function getKpis(query: {
  type?: string;
  status?: string;
  region?: string;
}) {
  const vehicleWhere: {
    type?: string;
    status?: VehicleStatus;
    region?: string;
  } = {};

  if (query.type) vehicleWhere.type = query.type;
  if (query.region) vehicleWhere.region = query.region;

  const [
    totalVehicles,
    availableVehicles,
    vehiclesOnTrip,
    vehiclesInShop,
    retiredVehicles,
    activeTrips,
    draftTrips,
    completedTripsToday,
    totalDrivers,
    driversOnDuty,
    availableDrivers,
  ] = await Promise.all([
    prisma.vehicle.count({ where: vehicleWhere }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.AVAILABLE } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.ON_TRIP } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.IN_SHOP } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.RETIRED } }),
    prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
    prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
    prisma.trip.count({
      where: {
        status: TripStatus.COMPLETED,
        completedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.driver.count(),
    prisma.driver.count({ where: { status: DriverStatus.ON_TRIP } }),
    prisma.driver.count({ where: { status: DriverStatus.AVAILABLE } }),
  ]);

  const activeVehicles = totalVehicles - retiredVehicles;
  const fleetUtilization = calcFleetUtilization(vehiclesOnTrip, activeVehicles);

  return {
    vehicles: {
      total: totalVehicles,
      available: availableVehicles,
      onTrip: vehiclesOnTrip,
      inShop: vehiclesInShop,
      retired: retiredVehicles,
      active: activeVehicles,
    },
    trips: {
      active: activeTrips,
      pending: draftTrips,
      completedToday: completedTripsToday,
    },
    drivers: {
      total: totalDrivers,
      onDuty: driversOnDuty,
      available: availableDrivers,
    },
    fleetUtilization,
  };
}
