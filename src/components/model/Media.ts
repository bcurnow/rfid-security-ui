import { BaseModel } from './BaseModel'


export class Media extends BaseModel<Media> {
  id: string = undefined as any
  name: string = undefined as any
  desc: string = undefined as any

  override inputExcludedProperties(): Set<string> {
    return new Set([])
  }
  constructor(data: Partial<Media>) {
    super(data)
    Object.assign(this, data)
  }

  override displayIdentifier(): string {
    return this.name
  }
}