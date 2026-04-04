import axios, { type AxiosResponse } from 'axios'
import api from './Base'
import Sound, { type SoundSpec } from '@/components/model/Sound'
import { combineURLs } from './Base'

const BASE_URL = '/sounds'

const svc = {
  create: function(data: SoundSpec): Promise<AxiosResponse> {
    return api.post<void>(BASE_URL, data)
  },
  delete: function(id: string): Promise<AxiosResponse> {
    return api.delete<void>(combineURLs(BASE_URL, String(id)), {})
  },
  async get(id: string): Promise<Sound> {
    const response = await api.get<SoundSpec>(combineURLs(BASE_URL, String(id)), {})
    return new Sound(response.data)
  },
  async list(): Promise<Sound[]> {
    const response = await api.get<SoundSpec[]>(BASE_URL, {})
    return response.data.map(item => new Sound(item))
  },
  update: function(id: string, data: SoundSpec): Promise<AxiosResponse> {
    return api.put<void>(combineURLs(BASE_URL, String(id)), data)
  }
}

export default svc
