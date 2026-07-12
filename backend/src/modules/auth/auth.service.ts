import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma';
import { signToken } from '../../lib/jwt';
import { AppError } from '../../middleware/error.middleware';

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) throw new AppError('Invalid email or password', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid email or password', 401);

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) throw new AppError('User not found', 404);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    createdAt: user.createdAt,
  };
}
