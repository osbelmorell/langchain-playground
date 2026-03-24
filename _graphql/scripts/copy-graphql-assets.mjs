import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(currentDir, '..')
const sourceDir = path.join(rootDir, 'src', 'graphql', 'schema')
const destinationDir = path.join(rootDir, 'dist', 'graphql', 'schema')

await mkdir(destinationDir, { recursive: true })
await cp(sourceDir, destinationDir, { recursive: true })