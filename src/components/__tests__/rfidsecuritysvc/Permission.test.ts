import { describe, it, expect, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { permissionSvc } from '@/components/rfidsecuritysvc/Permission'
import { Permission } from '@/components/model'
import { mockAxios } from '../helpers/mockAxios'
import type { AxiosInstance } from 'axios'

let ax: AxiosInstance
let svc: ReturnType<typeof permissionSvc>

beforeEach(() => {
  ax = mockAxios()
  svc = permissionSvc(ax)
})

const apiPermission = { id: 1, name: 'DOOR_A', desc: 'Front door access' }

describe('permissionSvc', () => {
  describe('create', () => {
    it('POSTs to /permissions and returns a Permission', async () => {
      ;(ax.post as Mock).mockResolvedValue({ data: apiPermission })
      const item = new Permission({ id: 1, name: 'DOOR_A', desc: 'Front door access' })
      const result = await svc.create(item)
      expect(ax.post).toHaveBeenCalledWith('/permissions', item)
      expect(result).toBeInstanceOf(Permission)
      expect(result.name).toBe('DOOR_A')
    })
  })

  describe('delete', () => {
    it('DELETEs /permissions/:id', async () => {
      const response = { status: 204 }
      ;(ax.delete as Mock).mockResolvedValue(response)
      const result = await svc.delete(1)
      expect(ax.delete).toHaveBeenCalledWith('/permissions/1', {})
      expect(result).toBe(response)
    })
  })

  describe('get', () => {
    it('GETs /permissions/:id and returns a Permission', async () => {
      ;(ax.get as Mock).mockResolvedValue({ data: apiPermission })
      const result = await svc.get(1)
      expect(ax.get).toHaveBeenCalledWith('/permissions/1', {})
      expect(result).toBeInstanceOf(Permission)
      expect(result.desc).toBe('Front door access')
    })
  })

  describe('list', () => {
    it('GETs /permissions and returns Permission[]', async () => {
      ;(ax.get as Mock).mockResolvedValue({
        data: [apiPermission, { id: 2, name: 'DOOR_B', desc: 'Back door' }],
      })
      const result = await svc.list()
      expect(ax.get).toHaveBeenCalledWith('/permissions', {})
      expect(result).toHaveLength(2)
      expect(result[0]).toBeInstanceOf(Permission)
      expect(result[1].name).toBe('DOOR_B')
    })
  })

  describe('update', () => {
    it('PUTs /permissions/:id with toApiInput', async () => {
      const response = { status: 200 }
      ;(ax.put as Mock).mockResolvedValue(response)
      const item = new Permission({ id: 1, name: 'DOOR_A', desc: 'Updated desc' })
      const result = await svc.update(item)
      expect(ax.put).toHaveBeenCalledWith('/permissions/1', { name: 'DOOR_A', desc: 'Updated desc' })
      expect(result).toBe(response)
    })
  })
})
