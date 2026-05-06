import { describe, it, expect, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { guestMediaSvc } from '@/components/rfidsecuritysvc/GuestMedia'
import { GuestMedia, Guest, Media } from '@/components/model'
import { mockAxios } from '../helpers/mockAxios'
import type { AxiosInstance } from 'axios'

let ax: AxiosInstance
let svc: ReturnType<typeof guestMediaSvc>

beforeEach(() => {
  ax = mockAxios()
  svc = guestMediaSvc(ax)
})

const apiGuestMedia = {
  id: 10,
  guest: { id: 1, first_name: 'John', last_name: 'Doe' },
  media: { id: 'abc', name: 'Card', desc: '' },
  sound: null,
  color: null,
}

describe('guestMediaSvc', () => {
  describe('create', () => {
    it('POSTs to /guest-media with toApiInput and returns a GuestMedia', async () => {
      ;(ax.post as Mock).mockResolvedValue({ data: apiGuestMedia })
      const item = new GuestMedia({
        id: 10,
        guest: new Guest({ id: 1, firstName: 'John', lastName: 'Doe' }),
        media: new Media({ id: 'abc', name: 'Card', desc: '' }),
      })
      const result = await svc.create(item)
      expect(ax.post).toHaveBeenCalledWith('/guest-media', { media_id: 'abc', guest_id: 1 })
      expect(result).toBeInstanceOf(GuestMedia)
      expect(result.id).toBe(10)
    })
  })

  describe('delete', () => {
    it('DELETEs /guest-media/:id', async () => {
      const response = { status: 204 }
      ;(ax.delete as Mock).mockResolvedValue(response)
      const result = await svc.delete(10)
      expect(ax.delete).toHaveBeenCalledWith('/guest-media/10')
      expect(result).toBe(response)
    })
  })

  describe('get', () => {
    it('GETs /guest-media/:id and returns a GuestMedia', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: apiGuestMedia })
      const result = await svc.get(10)
      expect(ax.get).toHaveBeenCalledWith('/guest-media/10')
      expect(result).toBeInstanceOf(GuestMedia)
    })
  })

  describe('list', () => {
    it('GETs /guest-media and returns GuestMedia[]', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: [apiGuestMedia] })
      const result = await svc.list()
      expect(ax.get).toHaveBeenCalledWith('/guest-media')
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(GuestMedia)
    })
  })

  describe('listByGuest', () => {
    it('GETs /guest-media with guest_id param and returns GuestMedia[]', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: [apiGuestMedia] })
      const result = await svc.listByGuest(1)
      expect(ax.get).toHaveBeenCalledWith('/guest-media', { params: { guest_id: 1 } })
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(GuestMedia)
    })
  })

  describe('update', () => {
    it('PUTs /guest-media/:id with toApiInput', async () => {
      const response = { status: 200 }
      ;(ax.put as Mock).mockResolvedValue(response)
      const item = new GuestMedia({
        id: 10,
        guest: new Guest({ id: 1, firstName: 'John', lastName: 'Doe' }),
        media: new Media({ id: 'abc', name: 'Card', desc: '' }),
      })
      const result = await svc.update(item)
      expect(ax.put).toHaveBeenCalledWith('/guest-media/10', { media_id: 'abc', guest_id: 1 })
      expect(result).toBe(response)
    })
  })
})
