import { describe, it, expect, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { mediaSvc } from '@/components/rfidsecuritysvc/Media'
import { Media } from '@/components/model'
import { mockAxios } from '../helpers/mockAxios'
import type { AxiosInstance } from 'axios'

let ax: AxiosInstance
let svc: ReturnType<typeof mediaSvc>

beforeEach(() => {
  ax = mockAxios()
  svc = mediaSvc(ax)
})

const apiMedia = { id: 'deadbeef', name: 'Key Card', desc: 'Main entry card' }

describe('mediaSvc', () => {
  describe('create', () => {
    it('POSTs to /media with toApiInput and returns a Media', async () => {
      ;(ax.post as Mock).mockResolvedValue({ data: apiMedia })
      const item = new Media({ id: 'deadbeef', name: 'Key Card', desc: 'Main entry card' })
      const result = await svc.create(item)
      expect(ax.post).toHaveBeenCalledWith('/media', { id: 'deadbeef', name: 'Key Card', desc: 'Main entry card' })
      expect(result).toBeInstanceOf(Media)
      expect(result.id).toBe('deadbeef')
    })
  })

  describe('delete', () => {
    it('DELETEs /media/:id', async () => {
      const response = { status: 204 }
      ;(ax.delete as Mock).mockResolvedValue(response)
      const result = await svc.delete('deadbeef')
      expect(ax.delete).toHaveBeenCalledWith('/media/deadbeef')
      expect(result).toBe(response)
    })
  })

  describe('get', () => {
    it('GETs /media/:id and returns a Media', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: apiMedia })
      const result = await svc.get('deadbeef')
      expect(ax.get).toHaveBeenCalledWith('/media/deadbeef')
      expect(result).toBeInstanceOf(Media)
      expect(result.name).toBe('Key Card')
    })
  })

  describe('list', () => {
    it('GETs /media and returns Media[]', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: [apiMedia, { id: 'cafe', name: 'Fob', desc: '' }] })
      const result = await svc.list()
      expect(ax.get).toHaveBeenCalledWith('/media')
      expect(result).toHaveLength(2)
      expect(result[0]).toBeInstanceOf(Media)
    })
  })

  describe('listUnassociated', () => {
    it('GETs /media with exclude_associated param', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: [apiMedia] })
      const result = await svc.listUnassociated()
      expect(ax.get).toHaveBeenCalledWith('/media', { params: { exclude_associated: true } })
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(Media)
    })
  })

  describe('update', () => {
    it('PUTs /media/:id with toApiInput', async () => {
      const response = { status: 200 }
      ;(ax.put as Mock).mockResolvedValue(response)
      const item = new Media({ id: 'deadbeef', name: 'Updated Card', desc: 'desc' })
      const result = await svc.update(item)
      expect(ax.put).toHaveBeenCalledWith(
        '/media/deadbeef',
        expect.objectContaining({ name: 'Updated Card' }),
      )
      expect(result).toBe(response)
    })
  })
})
