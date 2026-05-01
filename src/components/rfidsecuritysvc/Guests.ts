import { AxiosInstance, type AxiosResponse } from 'axios'
import { combineURLs } from '@/composables/useAxios';
import { Guest, GuestInput } from '@/components/model'

const BASE_URL = '/guests'

export const guestsSvc = (axios: AxiosInstance) => ({
  async create(guest: Guest): Promise<Guest> {
    const response = await axios.post<Guest>(BASE_URL, guest.toApiInput())
    return Guest.fromApi(response.data)
  },
  async delete(id: number): Promise<AxiosResponse> {
    return await axios.delete<void>(combineURLs(BASE_URL, String(id)), {})
  },
  async get(id: number): Promise<Guest> {
    const response = await axios.get<Guest>(combineURLs(BASE_URL, String(id)), {})
    return Guest.fromApi(response.data)
  },
  async list(): Promise<Guest[]> {
    const response = await axios.get<Guest[]>(BASE_URL, {})
    return response.data.map(item => Guest.fromApi(item))
  },
  async update(guest: Guest): Promise<AxiosResponse> {
    return axios.put<void>(combineURLs(BASE_URL, String(guest.id)), guest.toApiInput())
  }
})