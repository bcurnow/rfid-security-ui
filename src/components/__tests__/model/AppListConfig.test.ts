import { describe, it, expect, vi } from 'vitest'
import { AppListConfig } from '@/components/model/AppListConfig'
import { Permission } from '@/components/model/Permission'
import { Guest } from '@/components/model/Guest'

describe('AppListConfig', () => {
  describe('constructor', () => {
    it('stores itemClass and list function', () => {
      const listFn = vi.fn()
      const config = new AppListConfig(Permission, listFn)
      expect(config.itemClass).toBe(Permission)
      expect(config.list).toBe(listFn)
    })

    it('derives itemClassFields from model, excluding id', () => {
      const config = new AppListConfig(Permission, async () => [])
      config.showTableControls = false
      const fields = config.tableFields() as Array<{ key: string; sortable: boolean }>
      const keys = fields.map(f => f.key)
      expect(keys).toContain('name')
      expect(keys).toContain('desc')
      expect(keys).not.toContain('id')
    })

    it('accepts optional custom fields', () => {
      const customFields = [{ key: 'name', label: 'Permission Name', sortable: true }]
      const config = new AppListConfig(Permission, async () => [], customFields as any)
      config.showTableControls = false
      const fields = config.tableFields()
      expect(fields).toEqual(customFields)
    })

    it('sets sensible defaults', () => {
      const config = new AppListConfig(Permission, async () => [])
      expect(config.showTableControls).toBe(true)
      expect(config.filteringEnabled).toBe(true)
      expect(config.itemsPerPage).toBe(10)
      expect(config.modalOkEnabled).toBe(true)
      expect(config.modalOkOnly).toBe(false)
    })
  })

  describe('tableFields', () => {
    it('appends the controls field when showTableControls is true', () => {
      const config = new AppListConfig(Permission, async () => [])
      const fields = config.tableFields() as Array<{ key: string }>
      expect(fields[fields.length - 1].key).toBe('controls')
    })

    it('omits the controls field when showTableControls is false', () => {
      const config = new AppListConfig(Permission, async () => [])
      config.showTableControls = false
      const fields = config.tableFields() as Array<{ key: string }>
      expect(fields.every(f => f.key !== 'controls')).toBe(true)
    })

    it('uses itemClassFields for Guest (camelCase properties, id excluded)', () => {
      const config = new AppListConfig(Guest, async () => [])
      config.showTableControls = false
      const fields = config.tableFields() as Array<{ key: string }>
      const keys = fields.map(f => f.key)
      expect(keys).toContain('firstName')
      expect(keys).toContain('lastName')
      expect(keys).not.toContain('id')
    })
  })

  describe('createInstance', () => {
    it('creates a new instance of itemClass', () => {
      const config = new AppListConfig(Permission, async () => [])
      const instance = config.createInstance({ id: 7, name: 'TEST', desc: 'testing' })
      expect(instance).toBeInstanceOf(Permission)
      expect(instance.id).toBe(7)
      expect(instance.name).toBe('TEST')
    })

    it('creates an empty instance when given {}', () => {
      const config = new AppListConfig(Permission, async () => [])
      const instance = config.createInstance({})
      expect(instance).toBeInstanceOf(Permission)
    })
  })
})
