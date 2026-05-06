import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'
import { configSvc } from '@/components/rfidsecuritysvc/Config'
import { Config } from '@/components/model'
import { mockAxios } from '../helpers/mockAxios'
import type { AxiosInstance } from 'axios'

let ax: AxiosInstance
let svc: ReturnType<typeof configSvc>

beforeEach(() => {
  ax = mockAxios()
  svc = configSvc(ax)
})

const apiConfig = { key: 'API_KEY', value: 'secret' }

describe('configSvc', () => {
  describe('create', () => {
    it('POSTs to /configs with toApiInput and returns a Config', async () => {
      ;(ax.post as Mock).mockResolvedValue({ data: apiConfig })
      const item = new Config({ key: 'API_KEY', value: 'secret' })
      const result = await svc.create(item)
      expect(ax.post).toHaveBeenCalledWith('/configs', { key: 'API_KEY', value: 'secret' })
      expect(result).toBeInstanceOf(Config)
      expect(result.key).toBe('API_KEY')
    })
  })

  describe('delete', () => {
    it('DELETEs /configs/:key and returns the response', async () => {
      const response = { status: 204, data: null }
      ;(ax.delete as Mock).mockResolvedValue(response)
      const result = await svc.delete('API_KEY')
      expect(ax.delete).toHaveBeenCalledWith('/configs/API_KEY')
      expect(result).toBe(response)
    })
  })

  describe('get', () => {
    it('GETs /configs/:key and returns a Config', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: apiConfig })
      const result = await svc.get('API_KEY')
      expect(ax.get).toHaveBeenCalledWith('/configs/API_KEY')
      expect(result).toBeInstanceOf(Config)
      expect(result.value).toBe('secret')
    })
  })

  describe('list', () => {
    it('GETs /configs and returns Config[]', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: [apiConfig, { key: 'FOO', value: 'bar' }] })
      const result = await svc.list()
      expect(ax.get).toHaveBeenCalledWith('/configs')
      expect(result).toHaveLength(2)
      expect(result[0]).toBeInstanceOf(Config)
      expect(result[1].key).toBe('FOO')
    })
  })

  describe('update', () => {
    it('PUTs /configs/:key with toApiInput and returns the response', async () => {
      const response = { status: 200 }
      ;(ax.put as Mock).mockResolvedValue(response)
      const item = new Config({ key: 'API_KEY', value: 'new_secret' })
      const result = await svc.update(item)
      expect(ax.put).toHaveBeenCalledWith('/configs/API_KEY', { key: 'API_KEY', value: 'new_secret' })
      expect(result).toBe(response)
    })
  })
})
