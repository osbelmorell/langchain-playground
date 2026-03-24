import type { Resolvers } from './generated/resolvers-types'

const resolvers: Resolvers = {
  Query: {
    status: (_source, _args, context) => {
      return {
        service: `graphql-service (${context.env})`,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      }
    }
  }
}

export default resolvers