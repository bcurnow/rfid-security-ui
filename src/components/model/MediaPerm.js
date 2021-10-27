import BaseModel from './BaseModel'
import Media from './Media'
import Permission from './Permission'

export class MediaPerm extends BaseModel {
  static type = 'Media Permission'
  static primaryKey = 'id'

  constructor(api) {
    super()
    this.id = api.id
    this.media = new Media(api.media)
    this.permission = new Permission(api.permission)
  }

  displayIdentifier() {
    return `${this.permission.displayIdentifier()} on ${this.media.displayIdentifier()}`
  }
}

export default MediaPerm
