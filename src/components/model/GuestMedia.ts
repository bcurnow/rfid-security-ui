import BaseModel from './BaseModel'
import Color from './Color'
import Guest from './Guest'
import Media from './Media'
import Sound from './Sound'

export interface GuestMediaSpec {
  id: string
  guest: Guest
  media: Media
  sound?: Sound
  color?: Color
}

export class GuestMedia extends BaseModel {
  static type: string = 'Guest Media'
  static primaryKey: string = 'media.id'

  id: string
  guest: Guest
  media: Media
  sound: Sound | null
  color: Color | null
  
  constructor({id, guest, media, sound, color}: GuestMediaSpec) {
    super()
    this.id = id
    this.guest = new Guest(guest)
    this.media = new Media(media)
    this.sound = sound ? new Sound(sound) : null
    this.color = color ? new Color(color) : null
  }

  displayIdentifier(): string {
    return `${this.media.displayIdentifier()} for ${this.guest.displayIdentifier()}`
  }
}

export default GuestMedia
