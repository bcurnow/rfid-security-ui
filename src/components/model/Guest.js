import BaseModel from './BaseModel'
import Color from './Color'
import Sound from './Sound'

class Guest extends BaseModel {
  static type = 'Guest'
  static primaryKey = 'id'

  constructor(api) {
    super()
    this.id = api.id
    this.firstName = api.first_name
    this.lastName = api.last_name
    this.sound = null
    if (api.sound) {
        this.sound = new Sound(api.sound)
    }
    this.color = null
    if (api.color) {
      this.color = new Color(api.color)
    }
  }

  displayIdentifier() {
    return `${this.firstName} ${this.lastName}`
  }
}

export default Guest
