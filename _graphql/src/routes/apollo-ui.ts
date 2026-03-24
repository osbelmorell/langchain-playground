import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

import type { AppConfig } from '../config'

interface ApolloUiRoutesOptions {
  config: AppConfig
}

function buildApolloUiPage(config: AppConfig): string {
  const endpoint = `http://${config.host}:${config.port}${config.graphqlPath}`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Apollo Sandbox</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html,
      body,
      #embedded-sandbox {
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="embedded-sandbox" style="height: 100vh;"></div>
    <script src="https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js"></script>
    <script>
      new window.EmbeddedSandbox({
        target: '#embedded-sandbox',
        initialEndpoint: '${endpoint}',
        initialState: {
          document: 'query SandboxExample { hello(name: "Apollo") status { service timestamp } }',
        },
      });
    </script>
  </body>
</html>`
}

const apolloUiRoutes: FastifyPluginAsync<ApolloUiRoutesOptions> = (fastify, { config }) => {
  if (!config.apolloUiEnabled) {
    return Promise.resolve()
  }

  fastify.get(config.apolloUiPath, async (_request, reply) => {
    reply.type('text/html; charset=utf-8')
    return buildApolloUiPage(config)
  })

  return Promise.resolve()
}

export default fp(apolloUiRoutes, {
  name: 'apollo-ui-routes'
})