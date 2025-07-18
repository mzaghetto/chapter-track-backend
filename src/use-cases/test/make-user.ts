import { Users } from '@prisma/client'
import { randomUUID } from 'crypto'

export function makeUser(override: Partial<Users> = {}): Users {
  const user: Users = {
    id: override.id ?? randomUUID(),
    name: override.name ?? 'John Doe',
    email: override.email ?? `user-${randomUUID()}@example.com`,
    username: override.username ?? `johndoe-${randomUUID()}`,
    password_hash:
      'password_hash' in override ? override.password_hash ?? null : '123456',
    googleId: override.googleId ?? null,
    role: override.role ?? 'user',
    created_at: override.created_at ?? new Date(),
    updated_at: override.updated_at ?? null,
  }

  return user
}
