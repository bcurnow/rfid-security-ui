import { describe, it, expect } from 'vitest'
import { Permission } from '@/components/model/Permission'

describe('Permission', () => {
  describe('constructor', () => {
    it('assigns all properties', () => {
      const p = new Permission({ id: 1, name: 'DOOR_A', desc: 'Front door' })
      expect(p.id).toBe(1)
      expect(p.name).toBe('DOOR_A')
      expect(p.desc).toBe('Front door')
    })
  })

  describe('displayIdentifier', () => {
    it('returns the permission name', () => {
      const p = new Permission({ id: 1, name: 'ENTRY', desc: '' })
      expect(p.displayIdentifier()).toBe('ENTRY')
    })
  })

  describe('toApiInput', () => {
    it('excludes id and includes name and desc', () => {
      const p = new Permission({ id: 3, name: 'ROOM_B', desc: 'Back room' })
      expect(p.toApiInput()).toEqual({ name: 'ROOM_B', desc: 'Back room' })
    })
  })

  describe('static fromApi', () => {
    it('constructs from API response', () => {
      const p = Permission.fromApi({ id: 7, name: 'VAULT', desc: 'Vault access' })
      expect(p).toBeInstanceOf(Permission)
      expect(p.id).toBe(7)
      expect(p.name).toBe('VAULT')
    })
  })
})
