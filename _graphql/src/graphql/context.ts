import type { AppConfig } from '../config'

export interface GraphqlContext {
  requestId: string
  env: AppConfig['env']
}
