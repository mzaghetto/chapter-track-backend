import { Users, Role, Prisma } from '@prisma/client'

let userId = 1

export function makeUser(override: Partial<Prisma.UsersCreateInput> = {}): Prisma.UsersCreateInput {
  const user: Prisma.UsersCreateInput = {
    id: override.id ?? BigInt(userId++),
    name: override.name ?? 'John Doe',
    email: override.email ?? `user-${Math.random()}@example.com`,
    username: override.username ?? `johndoe-${Math.random()}`,
    password_hash: override.password_hash ?? '123456',
    googleId: override.googleId ?? null,
    role: override.role ?? Role.USER,
    preferences: override.preferences === null ? Prisma.JsonNull : override.preferences ?? undefined,
    lastLogin: override.lastLogin ?? null,
    resetPasswordToken: override.resetPasswordToken ?? null,
    resetPasswordExpires: override.resetPasswordExpires ?? null,
    createdAt: override.createdAt ?? new Date(),
    updatedAt: override.updatedAt ?? new Date(),
  }

  return user
}
