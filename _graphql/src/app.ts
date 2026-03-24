import Fastify from 'fastify'

import { getConfig, type AppConfig } from './config'
import graphqlPlugin from './graphql/index'
import apolloUiRoutes from './routes/apollo-ui'
import healthRoutes from './routes/health'

function buildLogger(config: AppConfig) {
  if (config.isDevelopment) {
    return {
      level: config.logLevel,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:standard'
        }
      }
    }
  }

  return {
    level: config.logLevel
  }
}

export function buildApp(config: AppConfig = getConfig()) {
  const app = Fastify({
    logger: buildLogger(config)
  })

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, 'request failed')

    if (reply.sent) {
      return
    }

    const statusCode =
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof error.statusCode === 'number'
        ? error.statusCode
        : 500

    const message = error instanceof Error ? error.message : 'Unexpected error'

    reply.status(statusCode).send({
      error: 'Internal Server Error',
      message
    })
  })

  app.register(healthRoutes, { config })
  app.register(graphqlPlugin, { config })
  app.register(apolloUiRoutes, { config })

  return app
}