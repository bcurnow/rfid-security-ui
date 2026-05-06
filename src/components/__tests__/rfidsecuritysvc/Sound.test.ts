import { describe, it, expect, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { soundSvc } from '@/components/rfidsecuritysvc/Sound'
import { Sound } from '@/components/model'
import { mockAxios } from '../helpers/mockAxios'
import type { AxiosInstance } from 'axios'

let ax: AxiosInstance
let svc: ReturnType<typeof soundSvc>

beforeEach(() => {
  ax = mockAxios()
  svc = soundSvc(ax)
})

const apiSound = { id: 1, name: 'beep', last_update_timestamp: '2024-01-01', content: '/sounds/beep.mp3' }

describe('soundSvc', () => {
  describe('create', () => {
    it('POSTs to /sounds as multipart form data and returns a Sound', async () => {
      ;(ax.post as Mock).mockResolvedValue({ data: apiSound })
      const file = new File(['audio'], 'beep.mp3', { type: 'audio/mpeg' })
      const result = await svc.create('beep', file)
      const [url, body, config] = (ax.post as Mock).mock.calls[0]
      expect(url).toBe('/sounds')
      expect(body).toBeInstanceOf(FormData)
      expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } })
      expect(result).toBeInstanceOf(Sound)
      expect(result.name).toBe('beep')
    })
  })

  describe('delete', () => {
    it('DELETEs /sounds/:id', async () => {
      const response = { status: 204 }
      ;(ax.delete as Mock).mockResolvedValue(response)
      const result = await svc.delete(1)
      expect(ax.delete).toHaveBeenCalledWith('/sounds/1', {})
      expect(result).toBe(response)
    })
  })

  describe('get', () => {
    it('GETs /sounds/:id and returns a Sound', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: apiSound })
      const result = await svc.get(1)
      expect(ax.get).toHaveBeenCalledWith('/sounds/1', {})
      expect(result).toBeInstanceOf(Sound)
      expect(result.id).toBe(1)
    })
  })

  describe('list', () => {
    it('GETs /sounds and returns Sound[]', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: [apiSound] })
      const result = await svc.list()
      expect(ax.get).toHaveBeenCalledWith('/sounds', {})
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(Sound)
    })
  })

  describe('update', () => {
    it('PUTs /sounds/:id as multipart form data', async () => {
      const response = { status: 200 }
      ;(ax.put as Mock).mockResolvedValue(response)
      const file = new File(['audio'], 'updated.mp3', { type: 'audio/mpeg' })
      const result = await svc.update(1, 'updated', file)
      const [url, body, config] = (ax.put as Mock).mock.calls[0]
      expect(url).toBe('/sounds/1')
      expect(body).toBeInstanceOf(FormData)
      expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } })
      expect(result).toBe(response)
    })
  })
})
