import { describe, it, expect } from 'vitest'
import { Config } from '@/components/model/Config'

describe('Config', () => {
  describe('static primaryKey', () => {
    it('returns "key"', () => {
      expect(Config.primaryKey()).toBe('key')
    })
  })

  describe('constructor', () => {
    it('assigns key and value', () => {
      const config = new Config({ key: 'MY_KEY', value: 'my_value' })
      expect(config.key).toBe('MY_KEY')
      expect(config.value).toBe('my_value')
    })
  })

  describe('toApiInput', () => {
    it('includes key and value but not id', () => {
      const config = new Config({ key: 'API_KEY', value: 'secret' })
      expect(config.toApiInput()).toEqual({ key: 'API_KEY', value: 'secret' })
    })
  })

  describe('displayIdentifier', () => {
    it('returns the key value', () => {
      const config = new Config({ key: 'ADMIN_API_KEY', value: 'x' })
      expect(config.displayIdentifier()).toBe('ADMIN_API_KEY')
    })

    it('returns empty string when key is empty', () => {
      const config = new Config({ key: '', value: 'x' })
      expect(config.displayIdentifier()).toBe('')
    })
  })

  describe('static fromApi', () => {
    it('converts snake_case API response', () => {
      const config = Config.fromApi({ key: 'FOO', value: 'bar' })
      expect(config).toBeInstanceOf(Config)
      expect(config.key).toBe('FOO')
      expect(config.value).toBe('bar')
    })
  })
})
