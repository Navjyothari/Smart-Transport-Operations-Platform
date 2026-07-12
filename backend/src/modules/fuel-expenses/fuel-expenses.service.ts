import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { ExpenseCategory } from '@prisma/client';

// ── Fuel Logs ──────────────────────────────────────────────────────────────

export async function getAllFuelLogs(query: { vehicleId?: string }) {
  return prisma.fuelLog.findMany({
    where: query.vehicleId ? { vehicleId: query.vehicleId } : {},
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
    },
    orderBy: { date: 'desc' },
  });
}

export async function createFuelLog(data: {
  vehicleId: string;
  liters: number;
  cost: number;
  date?: Date;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  return prisma.fuelLog.create({
    data: {
      vehicleId: data.vehicleId,
      liters: data.liters,
      cost: data.cost,
      date: data.date ?? new Date(),
    },
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
    },
  });
}

// ── Expenses ───────────────────────────────────────────────────────────────

export async function getAllExpenses(query: { vehicleId?: string }) {
  return prisma.expense.findMany({
    where: query.vehicleId ? { vehicleId: query.vehicleId } : {},
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
    },
    orderBy: { date: 'desc' },
  });
}

export async function createExpense(data: {
  vehicleId: string;
  category: ExpenseCategory;
  amount: number;
  notes?: string;
  date?: Date;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  return prisma.expense.create({
    data: {
      vehicleId: data.vehicleId,
      category: data.category,
      amount: data.amount,
      notes: data.notes,
      date: data.date ?? new Date(),
    },
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
    },
  });
}
