import axios, { type AxiosResponse } from 'axios'
import api from './Base'
import MediaPerm, { type MediaPermSpec } from '@/components/model/MediaPerm'
import { combineURLs } from './Base'

const BASE_URL = '/media-perms'

const svc = {
  create(data: MediaPermSpec): Promise<AxiosResponse> {
    return api.post<void>(BASE_URL, data)
  },
  delete(id: string): Promise<AxiosResponse> {
    return api.delete<void>(combineURLs(BASE_URL, String(id)), {})
  },
  async get(id: string): Promise<MediaPerm> {
    const response = await api.get<MediaPermSpec>(combineURLs(BASE_URL, String(id)), {})
    return new MediaPerm(response.data)
  },
  async list(): Promise<MediaPerm[]> {
    const response = await api.get<MediaPermSpec[]>(BASE_URL, {})
    return response.data.map(item => new MediaPerm(item))
  },
  async listByMedia(mediaId: string): Promise<MediaPerm[]> {
    const response = await api.get<MediaPermSpec[]>(BASE_URL, { params: { media_id: mediaId } })
    return response.data.map(item => new MediaPerm(item))
  },
}

export default svc
