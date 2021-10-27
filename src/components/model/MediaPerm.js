import BaseModel from "./BaseModel"

export class MediaPerm extends BaseModel {
  static type = 'Media Permission'
  static primaryKey = 'id'

  constructor(api) {
    super()
    this.id = api.id
    this.media = api.media
    this.permission = api.permission
  }
}

export default MediaPerm
