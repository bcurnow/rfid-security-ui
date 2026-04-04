import axios, { type AxiosResponse } from 'axios'
import api from './Base'
import Permission, { type PermissionSpec } from '@/components/model/Permission'
import { combineURLs } from './Base'

const BASE_URL = '/permissions'

const svc = {
  create(data: PermissionSpec): Promise<AxiosResponse> {
    return api.post<void>(BASE_URL, data)
  },
  delete(id: string): Promise<AxiosResponse> {
    return api.delete<void>(combineURLs(BASE_URL, String(id)), {})
  },
  async get(id: string): Promise<Permission> {
    const response = await api.get<PermissionSpec>(combineURLs(BASE_URL, String(id)), {})
    return new Permission(response.data)
  },
  async list(): Promise<Permission[]> {
    const response = await api.get<PermissionSpec[]>(BASE_URL, {})
    return response.data.map(item => new Permission(item))
  },
  async update(id: string, name: string, desc: string): Promise<AxiosResponse> {
    return api.put<void>(combineURLs(BASE_URL, String(id)), {
      name: name,
      desc: desc,
    })
  }
}

export default svc
