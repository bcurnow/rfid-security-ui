import { describe, it, expect, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { guestsSvc } from '@/components/rfidsecuritysvc/Guests'
import { Guest } from '@/components/model'
import { mockAxios } from '../helpers/mockAxios'
import type { AxiosInstance } from 'axios'

let ax: AxiosInstance
let svc: ReturnType<typeof guestsSvc>

beforeEach(() => {
  ax = mockAxios()
  svc = guestsSvc(ax)
})

const apiGuest = { id: 1, first_name: 'John', last_name: 'Doe', sound: null, color: null }

describe('guestsSvc', () => {
  describe('create', () => {
    it('POSTs to /guests with toApiInput and returns a Guest', async () => {
      ;(ax.post as Mock).mockResolvedValue({ data: apiGuest })
      const item = new Guest({ id: 1, firstName: 'John', lastName: 'Doe' })
      const result = await svc.create(item)
      expect(ax.post).toHaveBeenCalledWith(
        '/guests',
        expect.objectContaining({ first_name: 'John', last_name: 'Doe' }),
      )
      expect(result).toBeInstanceOf(Guest)
      expect(result.firstName).toBe('John')
    })
  })

  describe('delete', () => {
    it('DELETEs /guests/:id', async () => {
      const response = { status: 204 }
      ;(ax.delete as Mock).mockResolvedValue(response)
      const result = await svc.delete(1)
      expect(ax.delete).toHaveBeenCalledWith('/guests/1')
      expect(result).toBe(response)
    })
  })

  describe('get', () => {
    it('GETs /guests/:id and returns a Guest', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: apiGuest })
      const result = await svc.get(1)
      expect(ax.get).toHaveBeenCalledWith('/guests/1')
      expect(result).toBeInstanceOf(Guest)
      expect(result.lastName).toBe('Doe')
    })
  })

  describe('list', () => {
    it('GETs /guests and returns Guest[]', async () => {
      ;(ax.get as Mock).mockResolvedValue({
        data: [apiGuest, { id: 2, first_name: 'Jane', last_name: 'Smith', sound: null, color: null }],
      })
      const result = await svc.list()
      expect(ax.get).toHaveBeenCalledWith('/guests')
      expect(result).toHaveLength(2)
      expect(result[0]).toBeInstanceOf(Guest)
      expect(result[1].firstName).toBe('Jane')
    })
  })

  describe('update', () => {
    it('PUTs /guests/:id with toApiInput', async () => {
      const response = { status: 200 }
      ;(ax.put as Mock).mockResolvedValue(response)
      const item = new Guest({ id: 1, firstName: 'John', lastName: 'Updated' })
      const result = await svc.update(item)
      expect(ax.put).toHaveBeenCalledWith(
        '/guests/1',
        expect.objectContaining({ first_name: 'John', last_name: 'Updated' }),
      )
      expect(result).toBe(response)
    })
  })
})
