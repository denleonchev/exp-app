export interface IConfigService {
  databaseURL: string
  salt: number
  secret: string
  validate: () => Promise<void>
}
