import { BaseModel } from './BaseModel'

export class Config extends BaseModel<Config> {

  static override primaryKey(): string {
    return 'key'
  }
  
  key: string = undefined as any
  value: string = undefined as any
  
  constructor(data: Partial<Config>) {
    super(data)
    Object.assign(this, data)
  }
}