import { AxiosInstance, type AxiosResponse } from 'axios'
import {GuestMedia } from '@/components/model'
import { combineURLs } from '@/composables/useAxios';

const BASE_URL = '/guest-media'

export const guestMediaSvc = (axios: AxiosInstance) => ({
  async create(data: GuestMedia): Promise<GuestMedia>  {
    const response = await axios.post<GuestMedia>(BASE_URL, data.toApiInput())
    return GuestMedia.fromApi(response.data)
  },
  async delete(id: number): Promise<AxiosResponse> {
    return axios.delete<void>(combineURLs(BASE_URL, String(id)))
  },
  async get(id: number): Promise<GuestMedia> {
    const response = await axios.get<GuestMedia>(combineURLs(BASE_URL, String(id)))
    return GuestMedia.fromApi(response.data)
  },
  async list(): Promise<GuestMedia[]> {
    const response = await axios.get<GuestMedia[]>(BASE_URL)
    return response.data.map(item => GuestMedia.fromApi(item))
  },
  async listByGuest(guestId: number): Promise<GuestMedia[]> {
    const response = await axios.get<GuestMedia[][]>(BASE_URL, { params: { guest_id: guestId } })
    return response.data.map(item => GuestMedia.fromApi(item))
  },
  update(guestMedia: GuestMedia): Promise<AxiosResponse> {
    return axios.put(combineURLs(BASE_URL, String(guestMedia.id)), guestMedia.toApiInput())
  }
})