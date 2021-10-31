import BaseModel from './BaseModel'
import Color from './Color'
import Guest from './Guest'
import Media from './Media'
import Sound from './Sound'

export class GuestMedia extends BaseModel {
  static type = 'Guest Media'
  static primaryKey = 'media.id'

  constructor(api) {
    super()
    this.id = api.id
    this.guest = new Guest(api.guest || {})
    this.media = new Media(api.media || {})
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
    return `${this.media.displayIdentifier()} for ${this.guest.displayIdentifier()}`
  }
}

export default GuestMedia
