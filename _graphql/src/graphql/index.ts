import fp from 'fastify-plugin'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import mercurius, { type IResolvers } from 'mercurius'
import type { FastifyPluginAsync } from 'fastify'
import { print } from 'graphql'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import type { AppConfig } from '../config'
import type { GraphqlContext } from './context'

const graphqlDir = path.dirname(fileURLToPath(import.meta.url))
const schemaDir = path.join(graphqlDir, 'schema')
const resolversDir = path.join(graphqlDir, 'resolvers')

function loadSchema(): string {
  const typeDefs = mergeTypeDefs(
    loadFilesSync(path.join(schemaDir, '**/*.graphql'), {
      ignoreIndex: true
    })
  )

  return typeof typeDefs === 'string' ? typeDefs : print(typeDefs)
}

async function collectResolverFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return collectResolverFiles(entryPath)
      }

      if (
        !entry.isFile() ||
        entry.name.startsWith('index.') ||
        entry.name.endsWith('.d.ts') ||
        !['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'].includes(path.extname(entry.name))
      ) {
        return []
      }

      return [entryPath]
    })
  )

  return files.flat().sort((left, right) => left.localeCompare(right))
}

async function loadResolvers(): Promise<IResolvers> {
  const resolverFiles = await collectResolverFiles(resolversDir)
  const resolverModules = await Promise.all(
    resolverFiles.map(async (resolverFile) => {
      const importedModule = (await import(pathToFileURL(resolverFile).href)) as {
        default?: IResolvers
        resolvers?: IResolvers
      }

      return importedModule.default ?? importedModule.resolvers ?? {}
    })
  )

  const mergedResolvers: Record<string, unknown> = {}

  for (const resolverModule of resolverModules) {
    for (const [typeName, typeResolvers] of Object.entries(resolverModule)) {
      const currentTypeResolvers = mergedResolvers[typeName]

      mergedResolvers[typeName] = {
        ...(typeof currentTypeResolvers === 'object' && currentTypeResolvers !== null ? currentTypeResolvers : {}),
        ...(typeof typeResolvers === 'object' && typeResolvers !== null ? typeResolvers : {})
      }
    }
  }

  return mergedResolvers as IResolvers
}

interface GraphqlPluginOptions {
  config: AppConfig
}

const graphqlPlugin: FastifyPluginAsync<GraphqlPluginOptions> = async (fastify, { config }) => {
  const schema = loadSchema()
  const resolvers = await loadResolvers()

  await fastify.register(mercurius, {
    schema,
    resolvers,
    path: config.graphqlPath,
    ide: config.graphqlIdeEnabled ? 'graphiql' : false,
    jit: 1,
    context: (request): GraphqlContext => ({
      requestId: request.id,
      env: config.env
    })
  })
}

export default fp(graphqlPlugin, {
  name: 'graphql-plugin'
})