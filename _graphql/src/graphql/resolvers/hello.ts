import type { Resolvers } from './generated/resolvers-types'

const resolvers: Resolvers = {
  Query: {
    hello: (_source, { name }, context) => {
      return `Hello, ${name}. Request ${context.requestId}.`
    }
  }
}

export default resolvers