import { describe, it, expect } from 'vitest'
import { Guest } from '@/components/model/Guest'
import { Sound } from '@/components/model/Sound'
import { Color } from '@/components/model/Color'

describe('Guest', () => {
  describe('constructor', () => {
    it('assigns scalar properties', () => {
      const guest = new Guest({ id: 1, firstName: 'John', lastName: 'Doe' })
      expect(guest.id).toBe(1)
      expect(guest.firstName).toBe('John')
      expect(guest.lastName).toBe('Doe')
    })

    it('sets sound to null when not provided', () => {
      const guest = new Guest({ id: 1, firstName: 'John', lastName: 'Doe' })
      expect(guest.sound).toBeNull()
    })

    it('sets color to null when not provided', () => {
      const guest = new Guest({ id: 1, firstName: 'John', lastName: 'Doe' })
      expect(guest.color).toBeNull()
    })

    it('constructs a Sound instance from plain data', () => {
      const guest = new Guest({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        sound: { id: 5, name: 'beep' } as Sound,
      })
      expect(guest.sound).toBeInstanceOf(Sound)
      expect(guest.sound!.id).toBe(5)
      expect(guest.sound!.name).toBe('beep')
    })

    it('constructs a Color instance from plain data', () => {
      const guest = new Guest({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        color: { int: 0xff0000, hex: 'FF0000', html: '#ff0000' } as Color,
      })
      expect(guest.color).toBeInstanceOf(Color)
      expect(guest.color!.int).toBe(0xff0000)
    })
  })

  describe('displayIdentifier', () => {
    it('returns "firstName lastName"', () => {
      const guest = new Guest({ id: 1, firstName: 'Jane', lastName: 'Smith' })
      expect(guest.displayIdentifier()).toBe('Jane Smith')
    })
  })

  describe('toApiInput', () => {
    it('serializes a guest with null sound and color', () => {
      const guest = new Guest({ id: 1, firstName: 'John', lastName: 'Doe' })
      const result = guest.toApiInput() as Record<string, any>
      expect(result.first_name).toBe('John')
      expect(result.last_name).toBe('Doe')
      expect(result.sound).toBeNull()
      expect(result.color).toBeNull()
      expect(result).not.toHaveProperty('id')
    })

    it('serializes sound as its id', () => {
      const guest = new Guest({
        id: 1,
        firstName: 'A',
        lastName: 'B',
        sound: new Sound({ id: 7, name: 'ding' }),
      })
      const result = guest.toApiInput() as Record<string, any>
      expect(result.sound).toBe(7)
    })

    it('serializes color as its int', () => {
      const guest = new Guest({
        id: 1,
        firstName: 'A',
        lastName: 'B',
        color: new Color({ int: 255, hex: '0000FF', html: '#0000ff' }),
      })
      const result = guest.toApiInput() as Record<string, any>
      expect(result.color).toBe(255)
    })
  })

  describe('static fromApi', () => {
    it('converts snake_case and constructs nested objects', () => {
      const guest = Guest.fromApi({
        id: 2,
        first_name: 'Alice',
        last_name: 'Cooper',
        sound: { id: 3, name: 'chime', last_update_timestamp: '', content: '' },
        color: { int: 0x00ff00, hex: '00FF00', html: '#00ff00' },
      })
      expect(guest).toBeInstanceOf(Guest)
      expect(guest.firstName).toBe('Alice')
      expect(guest.lastName).toBe('Cooper')
      expect(guest.sound).toBeInstanceOf(Sound)
      expect(guest.color).toBeInstanceOf(Color)
    })
  })
})
