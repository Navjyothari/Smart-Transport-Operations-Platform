import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { Prisma, RequestStatus } from '@prisma/client';

export async function createRequest(data: {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: Date;
  contactNumber: string;
  email: string;
}) {
  // Check if licenseNumber is used by an existing Driver
  const existingDriver = await prisma.driver.findUnique({
    where: { licenseNumber: data.licenseNumber }
  });
  if (existingDriver) {
    throw new AppError(`License number '${data.licenseNumber}' is already registered to an active driver.`, 409);
  }

  // Check if licenseNumber is used by a PENDING DriverRequest
  const existingPending = await prisma.driverRequest.findFirst({
    where: {
      licenseNumber: data.licenseNumber,
      status: RequestStatus.PENDING
    }
  });
  if (existingPending) {
    throw new AppError(`A pending application with license number '${data.licenseNumber}' already exists.`, 409);
  }

  return prisma.driverRequest.create({
    data: {
      ...data,
      status: RequestStatus.PENDING
    }
  });
}

export async function getRequests(status?: RequestStatus) {
  const where: Prisma.DriverRequestWhereInput = {};
  if (status) {
    where.status = status;
  }
  return prisma.driverRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
}

export async function approveRequest(id: string, reviewedByUserId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Get and lock/check request
    const request = await tx.driverRequest.findUnique({
      where: { id }
    });
    if (!request) {
      throw new AppError('Driver request not found', 404);
    }
    if (request.status !== RequestStatus.PENDING) {
      throw new AppError(`Driver request is already ${request.status.toLowerCase()}`, 400);
    }

    // Double check that the driver license is not already registered in Driver table
    const existingDriver = await tx.driver.findUnique({
      where: { licenseNumber: request.licenseNumber }
    });
    if (existingDriver) {
      throw new AppError(`License number '${request.licenseNumber}' is already registered to an active driver.`, 409);
    }

    // 2. Create the Driver
    const newDriver = await tx.driver.create({
      data: {
        name: request.name,
        licenseNumber: request.licenseNumber,
        licenseCategory: request.licenseCategory,
        licenseExpiryDate: request.licenseExpiryDate,
        contactNumber: request.contactNumber,
        status: 'AVAILABLE',
        safetyScore: 100 // Default initial safety score
      }
    });

    // 3. Mark request as APPROVED
    await tx.driverRequest.update({
      where: { id },
      data: {
        status: RequestStatus.APPROVED,
        reviewedBy: reviewedByUserId,
        reviewedAt: new Date()
      }
    });

    return newDriver;
  });
}

export async function rejectRequest(id: string, reviewedByUserId: string, rejectionReason?: string) {
  const request = await prisma.driverRequest.findUnique({
    where: { id }
  });
  if (!request) {
    throw new AppError('Driver request not found', 404);
  }
  if (request.status !== RequestStatus.PENDING) {
    throw new AppError(`Driver request is already ${request.status.toLowerCase()}`, 400);
  }

  return prisma.driverRequest.update({
    where: { id },
    data: {
      status: RequestStatus.REJECTED,
      reviewedBy: reviewedByUserId,
      reviewedAt: new Date(),
      rejectionReason: rejectionReason || null
    }
  });
}
