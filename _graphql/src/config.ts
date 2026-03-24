export type NodeEnv = 'development' | 'test' | 'production'

export interface AppConfig {
  env: NodeEnv
  host: string
  port: number
  graphqlPath: string
  graphqlIdeEnabled: boolean
  apolloUiEnabled: boolean
  apolloUiPath: string
  isDevelopment: boolean
  logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}

function readEnv(): NodeEnv {
  const value = process.env.NODE_ENV

  if (value === 'production' || value === 'test') {
    return value
  }

  return 'development'
}

function readPort(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid PORT value: ${value}`)
  }

  return parsed
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

function readLogLevel(value: string | undefined): AppConfig['logLevel'] {
  switch (value) {
    case 'trace':
    case 'debug':
    case 'info':
    case 'warn':
    case 'error':
    case 'fatal':
      return value
    default:
      return 'info'
  }
}

export function getConfig(): AppConfig {
  const env = readEnv()

  return {
    env,
    host: process.env.HOST ?? '127.0.0.1',
    port: readPort(process.env.PORT, 4000),
    graphqlPath: process.env.GRAPHQL_PATH ?? '/graphql',
    graphqlIdeEnabled: readBoolean(process.env.GRAPHQL_IDE, env !== 'production'),
    apolloUiEnabled: readBoolean(process.env.APOLLO_UI_ENABLED, env !== 'production'),
    apolloUiPath: process.env.APOLLO_UI_PATH ?? '/apollo',
    isDevelopment: env === 'development',
    logLevel: readLogLevel(process.env.LOG_LEVEL)
  }
}