import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

import type { AppConfig } from '../config'

interface HealthRoutesOptions {
  config: AppConfig
}

const healthRoutes: FastifyPluginAsync<HealthRoutesOptions> = (fastify, { config }) => {
  fastify.get('/health', () => {
    return {
      ok: true,
      env: config.env,
      service: 'graphql-service'
    }
  })

  return Promise.resolve()
}

export default fp(healthRoutes, {
  name: 'health-routes'
})