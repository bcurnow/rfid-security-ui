import { describe, it, expect, afterEach, vi } from 'vitest'
import type { Mock } from 'vitest'
import { readerSvc } from '@/components/rfidsecuritysvc/Reader'
import { mockAxios } from '../helpers/mockAxios'
import type { AxiosInstance } from 'axios'

afterEach(() => vi.unstubAllEnvs())

describe('readerSvc', () => {
  describe('getUid (production path)', () => {
    it('GETs /reader and returns response.data as the UID string', async () => {
      const ax = mockAxios()
      ;(ax.get as Mock).mockResolvedValue({ data: 'DEADBEEF' })
      const svc = readerSvc(ax)
      const result = await svc.getUid()
      expect(ax.get).toHaveBeenCalledWith('/reader')
      expect(result).toBe('DEADBEEF')
    })
  })

  describe('getUid (development path)', () => {
    it('returns the hardcoded UID "000000" without calling axios', async () => {
      vi.stubEnv('MODE', 'development')
      const ax = mockAxios()
      const svc = readerSvc(ax)
      const result = await svc.getUid()
      expect(result).toBe('000000')
      expect(ax.get).not.toHaveBeenCalled()
    })
  })
})
