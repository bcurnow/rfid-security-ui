import { describe, it, expect } from 'vitest'
import { MediaPerm } from '@/components/model/MediaPerm'
import { Media } from '@/components/model/Media'
import { Permission } from '@/components/model/Permission'

function makeMediaPerm() {
  return new MediaPerm({
    id: 5,
    media: new Media({ id: 'abc', name: 'Card', desc: '' }),
    permission: new Permission({ id: 2, name: 'DOOR_A', desc: '' }),
  })
}

describe('MediaPerm', () => {
  describe('static displayName', () => {
    it('returns "Media Permission"', () => {
      expect(MediaPerm.displayName()).toBe('Media Permission')
    })
  })

  describe('constructor', () => {
    it('constructs nested Media and Permission instances', () => {
      const mp = makeMediaPerm()
      expect(mp.media).toBeInstanceOf(Media)
      expect(mp.permission).toBeInstanceOf(Permission)
    })

    it('uses empty objects for missing media and permission', () => {
      const mp = new MediaPerm({ id: 1 })
      expect(mp.media).toBeInstanceOf(Media)
      expect(mp.permission).toBeInstanceOf(Permission)
    })
  })

  describe('toApiInput', () => {
    it('returns { media_id, permission_id }', () => {
      const mp = makeMediaPerm()
      expect(mp.toApiInput()).toEqual({ media_id: 'abc', permission_id: 2 })
    })
  })

  describe('displayIdentifier', () => {
    it('returns "permission on media"', () => {
      const mp = makeMediaPerm()
      expect(mp.displayIdentifier()).toBe('DOOR_A on Card')
    })
  })

  describe('static fromApi', () => {
    it('constructs from API response', () => {
      const mp = MediaPerm.fromApi({
        id: 3,
        media: { id: 'tag1', name: 'Badge', desc: '' },
        permission: { id: 1, name: 'ENTRY', desc: 'Main entry' },
      })
      expect(mp).toBeInstanceOf(MediaPerm)
      expect(mp.media).toBeInstanceOf(Media)
      expect(mp.permission).toBeInstanceOf(Permission)
      expect(mp.permission.name).toBe('ENTRY')
    })
  })
})
