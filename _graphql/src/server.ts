import { getConfig } from './config'
import { buildApp } from './app'

const config = getConfig()
const app = buildApp(config)

async function shutdown(signal: NodeJS.Signals) {
  app.log.info({ signal }, 'shutting down')

  try {
    await app.close()
    process.exit(0)
  } catch (error) {
    app.log.error({ err: error }, 'graceful shutdown failed')
    process.exit(1)
  }
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void shutdown(signal)
  })
}

try {
  await app.listen({
    host: config.host,
    port: config.port
  })
} catch (error) {
  app.log.error({ err: error }, 'failed to start server')
  process.exit(1)
}