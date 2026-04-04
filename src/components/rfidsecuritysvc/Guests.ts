import axios, { type AxiosResponse } from 'axios'
import api from './Base.js'
import { combineURLs } from './Base'
import Guest, {type GuestSpec } from '@/components/model/Guest'
import List from '@/views/common/List.vue'

const BASE_URL = '/guests'

const svc = {
  create(data: GuestSpec): Promise<AxiosResponse> {
    return api.post<void>(BASE_URL, data)
  },
  delete(id: string): Promise<AxiosResponse> {
    return api.delete<void>(combineURLs(BASE_URL, String(id)), {})
  },
  async get(id: string): Promise<Guest> {
    const response = await api.get<GuestSpec>(combineURLs(BASE_URL, String(id)), {})
    return new Guest(response.data)
  },
  async List(): Promise<Guest[]> {
    const response = await api.get<GuestSpec[]>(BASE_URL, {})
    return response.data.map(item => new Guest(item))
  },
  async update(id: string, firstName: string, lastName: string, sound: string, color: string): Promise<AxiosResponse> {
    return api.put<void>(combineURLs(BASE_URL, String(id)), {
      first_name: firstName,
      last_name: lastName,
      sound: sound,
      color: color,
    })
  }
}

export default svc
