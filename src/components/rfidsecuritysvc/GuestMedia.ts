import axios, { type AxiosResponse } from 'axios'
import api from './Base'
import GuestMedia, { type GuestMediaSpec } from '@/components/model/GuestMedia'
import { combineURLs } from './Base'
import { s, st } from 'vue-router/dist/router-CWoNjPRp.mjs'

const BASE_URL = '/guest-media'

const svc = {
  create(data: GuestMediaSpec): Promise<AxiosResponse>  {
    return api.post<void>(BASE_URL, data)
  },
  delete(id: string): Promise<AxiosResponse> {
    return api.delete<void>(combineURLs(BASE_URL, String(id)))
  },
  async get(id: string): Promise<GuestMedia> {
    const response = await api.get<GuestMediaSpec>(combineURLs(BASE_URL, String(id)))
    return new GuestMedia(response.data)
  },
  async list(): Promise<GuestMedia[]> {
    const response = await api.get<GuestMediaSpec[]>(BASE_URL)
    return response.data.map(item => new GuestMedia(item))
  },
  async listByGuest(guestId: string): Promise<GuestMedia[]> {
    const response = await api.get<GuestMediaSpec[]>(BASE_URL, { params: { guest_id: guestId } })
    return response.data.map(item => new GuestMedia(item))
  },
  update(id: string, guestId: string, mediaId: string, sound: string, color: string): Promise<AxiosResponse> {
    return api.put(combineURLs(BASE_URL, String(id)), {
      guest_id: parseInt(guestId),
      media_id: mediaId,
      sound: sound,
      color: color,
    })
  }
}

export default svc
