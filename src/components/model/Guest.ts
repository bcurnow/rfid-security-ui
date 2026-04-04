import BaseModel from './BaseModel'
import Color from './Color'
import Sound from './Sound'

export interface GuestSpec {
  id: number
  firstName: string
  lastName: string
  sound?: Sound
  color?: Color
}

class Guest extends BaseModel {
  static type: string = 'Guest'
  static primaryKey: string = 'id'

  id: number
  firstName: string
  lastName: string
  sound: Sound | null
  color: Color | null

  constructor({ id, firstName, lastName, sound, color }: GuestSpec) {
    super()
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.sound = sound ? new Sound(sound) : null
    this.color = color ? new Color(color) : null
  }

  displayIdentifier() {
    return `${this.firstName} ${this.lastName}`
  }
}

export default Guest
