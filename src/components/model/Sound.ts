import { BaseModel } from './BaseModel'

export class Sound extends BaseModel<Sound> {

  // Need to override this entire method because the value is not an object, it's just the id property
  override toApiInput(): Record<string, any> | number | string {
    return this.id
  }
  
  id: number = undefined as any
  name: string = undefined as any
  lastUpdateTimestamp: string = undefined as any
  content: string = undefined as any
  
  constructor(data: Partial<Sound>) {
    super(data)
    Object.assign(this, data)
}

  override displayIdentifier(): string {
    return this.name
  }  
}