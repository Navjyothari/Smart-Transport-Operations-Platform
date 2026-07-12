import prisma from '../../lib/prisma';
import { VehicleStatus } from '@prisma/client';
import {
  calcFuelEfficiency,
  calcFleetUtilization,
  calcOperationalCost,
  calcVehicleROI,
} from '../../utils/calculations';
import { generateCsv } from '../../utils/csvExport';

export async function getFuelEfficiency(vehicleId?: string) {
  const vehicles = vehicleId
    ? await prisma.vehicle.findMany({ where: { id: vehicleId } })
    : await prisma.vehicle.findMany();

  const results = await Promise.all(
    vehicles.map(async (vehicle) => {
      const trips = await prisma.trip.findMany({
        where: {
          vehicleId: vehicle.id,
          status: 'COMPLETED',
          fuelConsumedL: { not: null },
          actualDistanceKm: { not: null },
        },
      });

      const totalDistance = trips.reduce((sum, t) => sum + (t.actualDistanceKm ?? 0), 0);
      const totalFuel = trips.reduce((sum, t) => sum + (t.fuelConsumedL ?? 0), 0);

      const fuelLogs = await prisma.fuelLog.aggregate({
        where: { vehicleId: vehicle.id },
        _sum: { liters: true, cost: true },
      });

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        type: vehicle.type,
        totalDistanceKm: totalDistance,
        totalFuelConsumedL: totalFuel + (fuelLogs._sum.liters ?? 0),
        fuelEfficiencyKmPerL: calcFuelEfficiency(totalDistance, totalFuel),
        totalFuelCost: fuelLogs._sum.cost ?? 0,
      };
    })
  );

  return results;
}

export async function getFleetUtilization() {
  const [totalVehicles, retiredVehicles, vehiclesOnTrip] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: VehicleStatus.RETIRED } }),
    prisma.vehicle.count({ where: { status: VehicleStatus.ON_TRIP } }),
  ]);

  const activeVehicles = totalVehicles - retiredVehicles;
  const utilization = calcFleetUtilization(vehiclesOnTrip, activeVehicles);

  // Daily trip counts for the last 7 days
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentTrips = await prisma.trip.findMany({
    where: {
      status: 'COMPLETED',
      completedAt: { gte: weekAgo },
    },
    select: { completedAt: true },
  });

  return {
    totalVehicles,
    activeVehicles,
    vehiclesOnTrip,
    fleetUtilizationPercent: utilization,
    recentCompletedTrips: recentTrips.length,
  };
}

export async function getOperationalCost(vehicleId?: string) {
  const vehicles = vehicleId
    ? await prisma.vehicle.findMany({ where: { id: vehicleId } })
    : await prisma.vehicle.findMany();

  const results = await Promise.all(
    vehicles.map(async (vehicle) => {
      const [fuelAgg, maintAgg, expenseAgg] = await Promise.all([
        prisma.fuelLog.aggregate({
          where: { vehicleId: vehicle.id },
          _sum: { cost: true },
        }),
        prisma.maintenanceLog.aggregate({
          where: { vehicleId: vehicle.id },
          _sum: { cost: true },
        }),
        prisma.expense.aggregate({
          where: { vehicleId: vehicle.id },
          _sum: { amount: true },
        }),
      ]);

      const fuelCost = fuelAgg._sum.cost ?? 0;
      const maintenanceCost = maintAgg._sum.cost ?? 0;
      const expenseAmount = expenseAgg._sum.amount ?? 0;
      const total = calcOperationalCost(fuelCost, maintenanceCost, expenseAmount);

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        fuelCost,
        maintenanceCost,
        otherExpenses: expenseAmount,
        totalOperationalCost: total,
      };
    })
  );

  return results;
}

export async function getVehicleROI(vehicleId?: string) {
  const vehicles = vehicleId
    ? await prisma.vehicle.findMany({ where: { id: vehicleId } })
    : await prisma.vehicle.findMany();

  const results = await Promise.all(
    vehicles.map(async (vehicle) => {
      const [revenueAgg, fuelAgg, maintAgg] = await Promise.all([
        prisma.trip.aggregate({
          where: { vehicleId: vehicle.id, status: 'COMPLETED' },
          _sum: { revenue: true },
        }),
        prisma.fuelLog.aggregate({
          where: { vehicleId: vehicle.id },
          _sum: { cost: true },
        }),
        prisma.maintenanceLog.aggregate({
          where: { vehicleId: vehicle.id },
          _sum: { cost: true },
        }),
      ]);

      const revenue = revenueAgg._sum.revenue ?? 0;
      const fuelCost = fuelAgg._sum.cost ?? 0;
      const maintenanceCost = maintAgg._sum.cost ?? 0;
      const roi = calcVehicleROI(revenue, maintenanceCost, fuelCost, vehicle.acquisitionCost);

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        acquisitionCost: vehicle.acquisitionCost,
        totalRevenue: revenue,
        fuelCost,
        maintenanceCost,
        roi,
        roiPercent: parseFloat((roi * 100).toFixed(2)),
      };
    })
  );

  return results;
}

export async function exportCsv(type: string): Promise<{ csv: string; filename: string }> {
  let data: object[] = [];
  let filename = `${type}-export-${Date.now()}.csv`;

  switch (type) {
    case 'vehicles':
      data = await prisma.vehicle.findMany();
      break;
    case 'trips':
      data = await prisma.trip.findMany({
        include: {
          vehicle: { select: { registrationNumber: true } },
          driver: { select: { name: true } },
        },
      });
      break;
    case 'expenses':
      data = await prisma.expense.findMany({
        include: { vehicle: { select: { registrationNumber: true } } },
      });
      break;
    case 'drivers':
      data = await prisma.driver.findMany();
      break;
    case 'fuel-logs':
      data = await prisma.fuelLog.findMany({
        include: { vehicle: { select: { registrationNumber: true } } },
      });
      break;
    default:
      data = [];
  }

  const csv = generateCsv(data as Record<string, unknown>[]);
  return { csv, filename };
}
