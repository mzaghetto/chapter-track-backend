import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Random Manhwas (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get random manhwas', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await prisma.manhwas.create({
      data: {
        name: 'The Beginning After the End',
        author: 'TurtleMe',
        description:
          'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Beneath the glamorous exterior of a powerful king lurks the shell of man, devoid of purpose and will.\n\nReincarnated into a new world filled with magic and monsters, the king has a second chance to relive his life. Correcting the mistakes of his past will not be his only challenge, however. Underneath the peace and prosperity of the new world is an undercurrent threatening to destroy everything he has worked for, questioning his role and reason for being born again.',
        status: "ONGOING",
        coverImage: 'https://example.com/manhwa.jpg',
        genre: ['Action', 'Fantasy'],
      },
    })

    const response = await request(app.server)
      .get('/manhwa/random')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.manhwas).toHaveLength(1)
  })
})
