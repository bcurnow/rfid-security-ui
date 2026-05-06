import { vi } from 'vitest'
import type { AxiosInstance } from 'axios'

export function mockAxios(): AxiosInstance {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as AxiosInstance
}
