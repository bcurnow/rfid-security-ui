import { describe, it, expect } from 'vitest'
import { Media } from '@/components/model/Media'

describe('Media', () => {
  describe('inputExcludedProperties', () => {
    it('returns an empty set (id is included)', () => {
      const media = new Media({ id: 'abc', name: 'Card', desc: '' })
      expect(media.inputExcludedProperties()).toEqual(new Set())
    })
  })

  describe('constructor', () => {
    it('assigns all properties', () => {
      const media = new Media({ id: 'tag123', name: 'Key Fob', desc: 'Main entry fob' })
      expect(media.id).toBe('tag123')
      expect(media.name).toBe('Key Fob')
      expect(media.desc).toBe('Main entry fob')
    })
  })

  describe('toApiInput', () => {
    it('includes id along with name and desc', () => {
      const media = new Media({ id: 'abc', name: 'Card', desc: 'desc' })
      expect(media.toApiInput()).toEqual({ id: 'abc', name: 'Card', desc: 'desc' })
    })
  })

  describe('displayIdentifier', () => {
    it('returns the media name', () => {
      const media = new Media({ id: 'x', name: 'Badge', desc: '' })
      expect(media.displayIdentifier()).toBe('Badge')
    })
  })

  describe('static fromApi', () => {
    it('constructs from API response', () => {
      const media = Media.fromApi({ id: 'deadbeef', name: 'Tag', desc: 'Access tag' })
      expect(media).toBeInstanceOf(Media)
      expect(media.id).toBe('deadbeef')
      expect(media.name).toBe('Tag')
    })
  })
})
