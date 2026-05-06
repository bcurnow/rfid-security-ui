import { describe, it, expect } from 'vitest'
import { GuestMedia } from '@/components/model/GuestMedia'
import { Guest } from '@/components/model/Guest'
import { Media } from '@/components/model/Media'
import { Sound } from '@/components/model/Sound'
import { Color } from '@/components/model/Color'

function makeGuestMedia() {
  return new GuestMedia({
    id: 10,
    guest: new Guest({ id: 1, firstName: 'John', lastName: 'Doe' }),
    media: new Media({ id: 'abc', name: 'Card', desc: '' }),
  })
}

describe('GuestMedia', () => {
  describe('static displayName', () => {
    it('returns "Guest Media"', () => {
      expect(GuestMedia.displayName()).toBe('Guest Media')
    })
  })

  describe('constructor', () => {
    it('constructs nested Guest and Media instances', () => {
      const gm = makeGuestMedia()
      expect(gm.guest).toBeInstanceOf(Guest)
      expect(gm.media).toBeInstanceOf(Media)
    })

    it('defaults sound and color to null', () => {
      const gm = makeGuestMedia()
      expect(gm.sound).toBeNull()
      expect(gm.color).toBeNull()
    })

    it('constructs Sound instance from plain data', () => {
      const gm = new GuestMedia({
        id: 1,
        guest: { id: 1, firstName: 'A', lastName: 'B' } as Guest,
        media: { id: 'x', name: 'M', desc: '' } as Media,
        sound: { id: 3, name: 'ping' } as Sound,
      })
      expect(gm.sound).toBeInstanceOf(Sound)
      expect(gm.sound!.id).toBe(3)
    })

    it('constructs Color instance from plain data', () => {
      const gm = new GuestMedia({
        id: 1,
        guest: { id: 1, firstName: 'A', lastName: 'B' } as Guest,
        media: { id: 'x', name: 'M', desc: '' } as Media,
        color: { int: 100, hex: '000064', html: '#000064' } as Color,
      })
      expect(gm.color).toBeInstanceOf(Color)
      expect(gm.color!.int).toBe(100)
    })

    it('uses empty objects for missing guest and media', () => {
      const gm = new GuestMedia({ id: 1 })
      expect(gm.guest).toBeInstanceOf(Guest)
      expect(gm.media).toBeInstanceOf(Media)
    })
  })

  describe('toApiInput', () => {
    it('returns { media_id, guest_id }', () => {
      const gm = makeGuestMedia()
      expect(gm.toApiInput()).toEqual({ media_id: 'abc', guest_id: 1 })
    })
  })

  describe('displayIdentifier', () => {
    it('returns "media for guest"', () => {
      const gm = makeGuestMedia()
      expect(gm.displayIdentifier()).toBe('Card for John Doe')
    })
  })

  describe('static fromApi', () => {
    it('constructs a GuestMedia with nested Guest and Media instances', () => {
      const gm = GuestMedia.fromApi({
        id: 5,
        guest: { id: 1, first_name: 'Jane', last_name: 'Smith' },
        media: { id: 'tag1', name: 'Badge', desc: '' },
        sound: null,
        color: null,
      })
      expect(gm).toBeInstanceOf(GuestMedia)
      expect(gm.id).toBe(5)
      expect(gm.guest).toBeInstanceOf(Guest)
      expect(gm.media).toBeInstanceOf(Media)
      // fromApi only converts top-level keys; nested objects retain original keys
      expect(gm.media.name).toBe('Badge')
    })
  })
})
