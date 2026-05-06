import { describe, it, expect, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { mediaPermsSvc } from '@/components/rfidsecuritysvc/MediaPerms'
import { MediaPerm, Media, Permission } from '@/components/model'
import { mockAxios } from '../helpers/mockAxios'
import type { AxiosInstance } from 'axios'

let ax: AxiosInstance
let svc: ReturnType<typeof mediaPermsSvc>

beforeEach(() => {
  ax = mockAxios()
  svc = mediaPermsSvc(ax)
})

const apiMediaPerm = {
  id: 5,
  media: { id: 'abc', name: 'Card', desc: '' },
  permission: { id: 2, name: 'DOOR_A', desc: '' },
}

describe('mediaPermsSvc', () => {
  describe('create', () => {
    it('POSTs to /media-perms with toApiInput and returns a MediaPerm', async () => {
      ;(ax.post as Mock).mockResolvedValue({ data: apiMediaPerm })
      const item = new MediaPerm({
        media: new Media({ id: 'abc', name: 'Card', desc: '' }),
        permission: new Permission({ id: 2, name: 'DOOR_A', desc: '' }),
      })
      const result = await svc.create(item)
      expect(ax.post).toHaveBeenCalledWith('/media-perms', { media_id: 'abc', permission_id: 2 })
      expect(result).toBeInstanceOf(MediaPerm)
      expect(result.id).toBe(5)
    })
  })

  describe('delete', () => {
    it('DELETEs /media-perms/:id', async () => {
      const response = { status: 204 }
      ;(ax.delete as Mock).mockResolvedValue(response)
      const result = await svc.delete(5)
      expect(ax.delete).toHaveBeenCalledWith('/media-perms/5', {})
      expect(result).toBe(response)
    })
  })

  describe('get', () => {
    it('GETs /media-perms/:id and returns a MediaPerm', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: apiMediaPerm })
      const result = await svc.get(5)
      expect(ax.get).toHaveBeenCalledWith('/media-perms/5', {})
      expect(result).toBeInstanceOf(MediaPerm)
    })
  })

  describe('list', () => {
    it('GETs /media-perms and returns MediaPerm[]', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: [apiMediaPerm] })
      const result = await svc.list()
      expect(ax.get).toHaveBeenCalledWith('/media-perms', {})
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(MediaPerm)
    })
  })

  describe('listByMedia', () => {
    it('GETs /media-perms with media_id param', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: [apiMediaPerm] })
      const result = await svc.listByMedia('abc')
      expect(ax.get).toHaveBeenCalledWith('/media-perms', { params: { media_id: 'abc' } })
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(MediaPerm)
    })
  })

  describe('update', () => {
    it('PUTs /media-perms/:id with toApiInput', async () => {
      const response = { status: 200 }
      ;(ax.put as Mock).mockResolvedValue(response)
      const item = new MediaPerm({
        id: 5,
        media: new Media({ id: 'abc', name: 'Card', desc: '' }),
        permission: new Permission({ id: 2, name: 'DOOR_A', desc: '' }),
      })
      const result = await svc.update(item)
      expect(ax.put).toHaveBeenCalledWith('/media-perms/5', { media_id: 'abc', permission_id: 2 })
      expect(result).toBe(response)
    })
  })
})
