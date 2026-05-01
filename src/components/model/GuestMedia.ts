import { BaseModel } from './BaseModel'
import { Color } from './Color'
import { Guest } from './Guest'
import { Media } from './Media'
import { Sound } from './Sound'

export class GuestMedia extends BaseModel<GuestMedia> {
  static override displayName(): string {
    return 'Guest Media'
  }

  id: number = undefined as any
  guest: Guest = undefined as any
  media: Media = undefined as any
  sound: Sound | null = undefined as any
  color: Color | null = undefined as any

  constructor(data: Partial<GuestMedia>) {
    super(data)
    Object.assign(this, data)
    // assign only populates plain values, not nested objects
    this.guest = new Guest(data.guest || {})
    this.media = new Media(data.media || {})
    this.sound = null
    if (data.sound) {
      this.sound = new Sound(data.sound)
    }
    this.color = null
    if (data.color) {
      this.color = new Color(data.color)
    }
  }

  override toApiInput(): Record<string, any> | number | string {
    return { media_id: this.media.id, guest_id: this.guest.id }
  }

  override displayIdentifier(): string {
    return `${this.media?.displayIdentifier()} for ${this.guest?.displayIdentifier()}`
  }
}