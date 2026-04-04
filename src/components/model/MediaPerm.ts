import BaseModel from './BaseModel'
import Media from './Media'
import Permission from './Permission'

export interface MediaPermSpec {
  id: string
  media: Media
  permission: Permission
}

export class MediaPerm extends BaseModel {
  static type: string = 'Media Permission'
  static primaryKey: string = 'id'

  id: string
  media: Media
  permission: Permission
  
  constructor({id, media, permission}: MediaPermSpec) {
    super()
    this.id = id
    this.media = new Media(media)
    this.permission = new Permission(permission)
  }

  displayIdentifier(): string {
    return `${this.permission.displayIdentifier()} on ${this.media.displayIdentifier()}`
  }
}

export default MediaPerm
