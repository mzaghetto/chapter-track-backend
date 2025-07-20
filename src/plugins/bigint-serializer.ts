import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

export default fp(async function (fastify: FastifyInstance) {
  fastify.setReplySerializer((payload) => {
    return JSON.stringify(payload, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    )
  })
})
