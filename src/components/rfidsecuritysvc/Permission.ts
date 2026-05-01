import { type AxiosResponse, AxiosInstance } from 'axios'
import { Permission } from '@/components/model'
import { combineURLs } from '@/composables/useAxios';

const BASE_URL = '/permissions'

export const permissionSvc = (axios: AxiosInstance) => ({
  async create(data: Permission): Promise<Permission> {
    const response = await axios.post<Permission>(BASE_URL, data)
    return Permission.fromApi(response.data)
  },
  delete(id: number): Promise<AxiosResponse> {
    return axios.delete<void>(combineURLs(BASE_URL, String(id)), {})
  },
  async get(id: number): Promise<Permission> {
    const response = await axios.get<Permission>(combineURLs(BASE_URL, String(id)), {})
    return Permission.fromApi(response.data)
  },
  async list(): Promise<Permission[]> {
    const response = await axios.get<Permission[]>(BASE_URL, {})
    return response.data.map(item => Permission.fromApi(item))
  },
  async update(permission: Permission): Promise<AxiosResponse> {
    return axios.put<void>(combineURLs(BASE_URL, String(permission.id)), permission.toApiInput())
  }
})