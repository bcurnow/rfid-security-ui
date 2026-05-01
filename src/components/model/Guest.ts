import { BaseModel, Color, Sound } from '@/components/model'

export class Guest extends BaseModel<Guest> {
  id: number = undefined as any
  firstName: string = undefined as any
  lastName: string = undefined as any
  sound: Sound | null = undefined as any
  color: Color | null = undefined as any

  constructor(data: Partial<Guest>) {
    super(data)
    Object.assign(this, data)

    // assign only populates plain values, not nested objects
    this.sound = null
    if (data.sound) {
      this.sound = new Sound(data.sound)
    }
    this.color = null
    if (data.color) {
      this.color = new Color(data.color)
    }
  }

  override displayIdentifier() {
    return `${this.firstName} ${this.lastName}`
  }
}