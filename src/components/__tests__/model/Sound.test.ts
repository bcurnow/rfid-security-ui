import { describe, it, expect } from 'vitest'
import { Sound } from '@/components/model/Sound'

describe('Sound', () => {
  describe('constructor', () => {
    it('assigns all properties', () => {
      const s = new Sound({ id: 1, name: 'beep', lastUpdateTimestamp: '2024-01-01', content: '/path' })
      expect(s.id).toBe(1)
      expect(s.name).toBe('beep')
      expect(s.lastUpdateTimestamp).toBe('2024-01-01')
      expect(s.content).toBe('/path')
    })
  })

  describe('toApiInput', () => {
    it('returns just the id', () => {
      const s = new Sound({ id: 42, name: 'chime', lastUpdateTimestamp: '', content: '' })
      expect(s.toApiInput()).toBe(42)
    })
  })

  describe('displayIdentifier', () => {
    it('returns the sound name', () => {
      const s = new Sound({ id: 1, name: 'ding-dong', lastUpdateTimestamp: '', content: '' })
      expect(s.displayIdentifier()).toBe('ding-dong')
    })
  })

  describe('static fromApi', () => {
    it('converts snake_case keys', () => {
      const s = Sound.fromApi({
        id: 3,
        name: 'alert',
        last_update_timestamp: '2024-06-01T00:00:00Z',
        content: '/sounds/alert.mp3',
      })
      expect(s).toBeInstanceOf(Sound)
      expect(s.id).toBe(3)
      expect(s.name).toBe('alert')
      expect(s.lastUpdateTimestamp).toBe('2024-06-01T00:00:00Z')
    })
  })
})
