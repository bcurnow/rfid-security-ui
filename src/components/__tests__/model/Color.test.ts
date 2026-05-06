import { describe, it, expect } from 'vitest'
import { Color } from '@/components/model/Color'

describe('Color', () => {
  describe('static primaryKey', () => {
    it('returns "int"', () => {
      expect(Color.primaryKey()).toBe('int')
    })
  })

  describe('static fromNumber', () => {
    it('constructs a Color from an integer', () => {
      const color = Color.fromNumber(0xff0000)
      expect(color).toBeInstanceOf(Color)
      expect(color.int).toBe(0xff0000)
    })

    it('sets hex as uppercase 6-char string', () => {
      const color = Color.fromNumber(0xff0000)
      expect(color.hex).toBe('FF0000')
    })

    it('sets html as #rrggbb', () => {
      const color = Color.fromNumber(0x1a2b3c)
      expect(color.html).toBe('#1a2b3c')
    })

    it('pads hex to 6 chars for small values', () => {
      const color = Color.fromNumber(0x000001)
      expect(color.hex).toBe('000001')
      expect(color.html).toBe('#000001')
    })
  })

  describe('toApiInput', () => {
    it('returns the int value', () => {
      const color = new Color({ int: 255, hex: '0000FF', html: '#0000ff' })
      expect(color.toApiInput()).toBe(255)
    })
  })

  describe('constructor', () => {
    it('assigns properties from data', () => {
      const color = new Color({ int: 100, hex: '000064', html: '#000064' })
      expect(color.int).toBe(100)
      expect(color.hex).toBe('000064')
      expect(color.html).toBe('#000064')
    })
  })
})
