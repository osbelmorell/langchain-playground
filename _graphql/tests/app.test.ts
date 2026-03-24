import { afterAll, describe, expect, it } from 'vitest'

import { buildApp } from '../src/app'

const app = buildApp({
  env: 'test',
  host: '127.0.0.1',
  port: 4000,
  graphqlPath: '/graphql',
  graphqlIdeEnabled: false,
  apolloUiEnabled: true,
  apolloUiPath: '/apollo',
  isDevelopment: false,
  logLevel: 'error'
})

afterAll(async () => {
  await app.close()
})

describe('graphql service', () => {
  it('returns health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      ok: true,
      env: 'test',
      service: 'graphql-service'
    })
  })

  it('executes graphql queries', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: '{ hello(name: "Copilot") status { service } }'
      }
    })

    const body = response.json<{
      data: {
        hello: string
        status: {
          service: string
        }
      }
    }>()

    expect(response.statusCode).toBe(200)
    expect(body.data.hello).toContain('Hello, Copilot.')
    expect(body.data.status.service).toBe('graphql-service (test)')
  })

  it('serves the Apollo UI route', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/apollo'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
    expect(response.body).toContain('Apollo Sandbox')
    expect(response.body).toContain('EmbeddedSandbox')
    expect(response.body).toContain('embeddable-sandbox.cdn.apollographql.com')
  })
})