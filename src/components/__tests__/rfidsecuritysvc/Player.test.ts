import { describe, it, expect } from 'vitest'
import { playerSvc } from '@/components/rfidsecuritysvc/Player'

describe('playerSvc', () => {
  describe('url', () => {
    it('combines the configured apiUrl with the player base and name', () => {
      const result = playerSvc.url('beep')
      expect(result).toBe('/api/v1.0/player/beep')
    })

    it('handles names with no trailing slash issues', () => {
      const result = playerSvc.url('alert-sound')
      expect(result).toBe('/api/v1.0/player/alert-sound')
    })
  })
})
