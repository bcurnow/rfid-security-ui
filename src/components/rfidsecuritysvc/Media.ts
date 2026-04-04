import axios, { type AxiosResponse } from 'axios'
import api from './Base'
import Media, { type MediaSpec } from '@/components/model/Media'
import { combineURLs } from './Base'

const BASE_URL = '/media'

const svc = {
  create(data: MediaSpec): Promise<AxiosResponse> {
    return api.post<void>(BASE_URL, data)
  },
  delete:(id: string): Promise<AxiosResponse> =>  {
    return api.delete<void>(combineURLs(BASE_URL, id), {})
  },
  async get(id: string): Promise<Media> {
    const response = await api.get<MediaSpec>(combineURLs(BASE_URL, id), {})
    return new Media(response.data)
  },
  async list(): Promise<Media[]> {
    const response = await api.get<MediaSpec[]>(BASE_URL, {})
    return response.data.map(item => new Media(item))
  },
  async listUnassociated(): Promise<Media[]> {
    const response = await api.get<MediaSpec[]>(BASE_URL, { params: { excludeAssociated: true } })
    return response.data.map(item => new Media(item))
  },
  async update(id: string, name: string, desc: string): Promise<AxiosResponse> {
    return api.put<void>(combineURLs(BASE_URL, id), {
      name: name,
      desc: desc,
    })
  }
}

export default svc
