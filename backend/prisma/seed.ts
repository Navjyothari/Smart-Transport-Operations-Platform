import { PrismaClient, VehicleStatus, DriverStatus, TripStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Roles ────────────────────────────────────────────────────────────────
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'FLEET_MANAGER' },
      update: {},
      create: { name: 'FLEET_MANAGER' },
    }),
    prisma.role.upsert({
      where: { name: 'DRIVER' },
      update: {},
      create: { name: 'DRIVER' },
    }),
    prisma.role.upsert({
      where: { name: 'SAFETY_OFFICER' },
      update: {},
      create: { name: 'SAFETY_OFFICER' },
    }),
    prisma.role.upsert({
      where: { name: 'FINANCIAL_ANALYST' },
      update: {},
      create: { name: 'FINANCIAL_ANALYST' },
    }),
  ]);

  const [fleetManagerRole, driverRole, safetyOfficerRole, financialAnalystRole] = roles;

  console.log('✅ Roles created');

  // ── Users (1 per role) ───────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'manager@transitops.com' },
    update: {},
    create: {
      name: 'Fleet Manager',
      email: 'manager@transitops.com',
      passwordHash,
      roleId: fleetManagerRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'driver@transitops.com' },
    update: {},
    create: {
      name: 'Alex Driver',
      email: 'driver@transitops.com',
      passwordHash,
      roleId: driverRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'safety@transitops.com' },
    update: {},
    create: {
      name: 'Safety Officer',
      email: 'safety@transitops.com',
      passwordHash,
      roleId: safetyOfficerRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'finance@transitops.com' },
    update: {},
    create: {
      name: 'Financial Analyst',
      email: 'finance@transitops.com',
      passwordHash,
      roleId: financialAnalystRole.id,
    },
  });

  console.log('✅ Users created (all passwords: password123)');

  // ── Vehicles (5, mixed statuses) ─────────────────────────────────────────
  const vehicle1 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'VAN-05' },
    update: {},
    create: {
      registrationNumber: 'VAN-05',
      name: 'Ford Transit Van-05',
      type: 'Van',
      maxLoadCapacityKg: 500,
      odometer: 12400,
      acquisitionCost: 35000,
      status: VehicleStatus.AVAILABLE,
      region: 'North',
    },
  });

  const vehicle2 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'TRK-12' },
    update: {},
    create: {
      registrationNumber: 'TRK-12',
      name: 'Volvo Truck TRK-12',
      type: 'Truck',
      maxLoadCapacityKg: 5000,
      odometer: 87300,
      acquisitionCost: 120000,
      status: VehicleStatus.ON_TRIP,
      region: 'South',
    },
  });

  const vehicle3 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'VAN-09' },
    update: {},
    create: {
      registrationNumber: 'VAN-09',
      name: 'Mercedes Sprinter Van-09',
      type: 'Van',
      maxLoadCapacityKg: 800,
      odometer: 34200,
      acquisitionCost: 45000,
      status: VehicleStatus.IN_SHOP,
      region: 'East',
    },
  });

  const vehicle4 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'BUS-03' },
    update: {},
    create: {
      registrationNumber: 'BUS-03',
      name: 'Bus BUS-03',
      type: 'Bus',
      maxLoadCapacityKg: 2000,
      odometer: 156000,
      acquisitionCost: 85000,
      status: VehicleStatus.AVAILABLE,
      region: 'West',
    },
  });

  await prisma.vehicle.upsert({
    where: { registrationNumber: 'TRK-07' },
    update: {},
    create: {
      registrationNumber: 'TRK-07',
      name: 'Tata Truck TRK-07',
      type: 'Truck',
      maxLoadCapacityKg: 8000,
      odometer: 220000,
      acquisitionCost: 95000,
      status: VehicleStatus.RETIRED,
      region: 'North',
    },
  });

  console.log('✅ Vehicles created');

  // ── Drivers (5, mixed statuses, one with expired license) ─────────────────
  const driver1 = await prisma.driver.upsert({
    where: { licenseNumber: 'DL-ALEX-001' },
    update: {},
    create: {
      name: 'Alex Johnson',
      licenseNumber: 'DL-ALEX-001',
      licenseCategory: 'HGV',
      licenseExpiryDate: new Date('2027-06-30'),
      contactNumber: '+91-9876543210',
      safetyScore: 95,
      status: DriverStatus.AVAILABLE,
    },
  });

  const driver2 = await prisma.driver.upsert({
    where: { licenseNumber: 'DL-MARIA-002' },
    update: {},
    create: {
      name: 'Maria Santos',
      licenseNumber: 'DL-MARIA-002',
      licenseCategory: 'LMV',
      licenseExpiryDate: new Date('2026-12-15'),
      contactNumber: '+91-9876543211',
      safetyScore: 88,
      status: DriverStatus.ON_TRIP,
    },
  });

  await prisma.driver.upsert({
    where: { licenseNumber: 'DL-RAJAN-003' },
    update: {},
    create: {
      name: 'Rajan Kumar',
      licenseNumber: 'DL-RAJAN-003',
      licenseCategory: 'HGV',
      // Expired license — 6 months ago
      licenseExpiryDate: new Date('2025-12-31'),
      contactNumber: '+91-9876543212',
      safetyScore: 72,
      status: DriverStatus.AVAILABLE,
    },
  });

  await prisma.driver.upsert({
    where: { licenseNumber: 'DL-PRIYA-004' },
    update: {},
    create: {
      name: 'Priya Mehta',
      licenseNumber: 'DL-PRIYA-004',
      licenseCategory: 'LMV',
      licenseExpiryDate: new Date('2028-03-20'),
      contactNumber: '+91-9876543213',
      safetyScore: 99,
      status: DriverStatus.OFF_DUTY,
    },
  });

  await prisma.driver.upsert({
    where: { licenseNumber: 'DL-SURESH-005' },
    update: {},
    create: {
      name: 'Suresh Patel',
      licenseNumber: 'DL-SURESH-005',
      licenseCategory: 'HGV',
      licenseExpiryDate: new Date('2027-09-10'),
      contactNumber: '+91-9876543214',
      safetyScore: 60,
      status: DriverStatus.SUSPENDED,
    },
  });

  console.log('✅ Drivers created');

  // ── Trips (2-3 sample trips) ──────────────────────────────────────────────
  await prisma.trip.upsert({
    where: { id: 'seed-trip-001' },
    update: {},
    create: {
      id: 'seed-trip-001',
      source: 'Mumbai Warehouse',
      destination: 'Pune Distribution Center',
      vehicleId: vehicle2.id,
      driverId: driver2.id,
      cargoWeightKg: 2400,
      plannedDistanceKm: 150,
      actualDistanceKm: 152,
      fuelConsumedL: 38,
      revenue: 18000,
      status: TripStatus.DISPATCHED,
      dispatchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  });

  await prisma.trip.upsert({
    where: { id: 'seed-trip-002' },
    update: {},
    create: {
      id: 'seed-trip-002',
      source: 'Delhi Hub',
      destination: 'Agra Depot',
      vehicleId: vehicle4.id,
      driverId: driver1.id,
      cargoWeightKg: 800,
      plannedDistanceKm: 200,
      actualDistanceKm: 198,
      fuelConsumedL: 60,
      revenue: 25000,
      status: TripStatus.COMPLETED,
      dispatchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    },
  });

  await prisma.trip.upsert({
    where: { id: 'seed-trip-003' },
    update: {},
    create: {
      id: 'seed-trip-003',
      source: 'Chennai Port',
      destination: 'Bangalore Warehouse',
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      cargoWeightKg: 450,
      plannedDistanceKm: 350,
      revenue: 0,
      status: TripStatus.DRAFT,
    },
  });

  console.log('✅ Trips created');

  // ── Maintenance Log (for IN_SHOP vehicle) ─────────────────────────────────
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: vehicle3.id,
      type: 'Engine Overhaul',
      cost: 12000,
      status: 'ACTIVE',
      notes: 'Complete engine inspection and overhaul required after 34k km service',
    },
  });

  console.log('✅ Maintenance log created');

  // ── Fuel Logs ─────────────────────────────────────────────────────────────
  await prisma.fuelLog.createMany({
    data: [
      { vehicleId: vehicle1.id, liters: 45, cost: 5400, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { vehicleId: vehicle2.id, liters: 120, cost: 14400, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { vehicleId: vehicle4.id, liters: 80, cost: 9600, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    ],
  });

  console.log('✅ Fuel logs created');

  // ── Expenses ──────────────────────────────────────────────────────────────
  await prisma.expense.createMany({
    data: [
      { vehicleId: vehicle1.id, category: 'TOLL', amount: 850, notes: 'Mumbai-Pune expressway toll' },
      { vehicleId: vehicle2.id, category: 'MAINTENANCE', amount: 3500, notes: 'Tyre replacement' },
      { vehicleId: vehicle4.id, category: 'OTHER', amount: 1200, notes: 'Parking charges' },
    ],
  });

  console.log('✅ Expenses created');

  console.log('\n🎉 Seed complete! Login credentials:');
  console.log('   manager@transitops.com  / password123  (FLEET_MANAGER)');
  console.log('   driver@transitops.com   / password123  (DRIVER)');
  console.log('   safety@transitops.com   / password123  (SAFETY_OFFICER)');
  console.log('   finance@transitops.com  / password123  (FINANCIAL_ANALYST)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
