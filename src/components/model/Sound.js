import BaseModel from './BaseModel'

class Sound extends BaseModel {
  static type = 'Sound'
  static primaryKey = 'id'

  constructor(api) {
    super()
    this.id = api.id
    this.name = api.name
    this.lastUpdateTimestamp = api.last_update_timestamp
    this.content = api.content
  }
}

export default Sound
