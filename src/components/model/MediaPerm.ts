import { BaseModel } from './BaseModel'
import { Media } from './Media'
import { Permission } from './Permission'

export class MediaPerm extends BaseModel<MediaPerm> {
  static override displayName() : string {
    return 'Media Permission'
  }

  id: number = undefined as any
  media: Media = undefined as any
  permission: Permission = undefined as any
  
  constructor(data: Partial<MediaPerm>) {
    super(data)
    Object.assign(this, data)
    // assign only populates plain values, not nested objects
    this.media = new Media(data.media || {})
    this.permission = new Permission(data.permission || {}) 
  }

  override displayIdentifier(): string {
    return `${this.permission?.displayIdentifier()} on ${this.media?.displayIdentifier()}`
  }

  override toApiInput(): Record<string, any> | number | string {
    return { media_id: this.media.id, permission_id: this.permission.id }
  }
}