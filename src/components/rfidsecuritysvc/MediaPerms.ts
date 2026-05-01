import { type AxiosResponse, AxiosInstance } from 'axios'
import { MediaPerm } from '@/components/model'
import { combineURLs } from '@/composables/useAxios';

const BASE_URL = '/media-perms'

export const mediaPermsSvc = (axios: AxiosInstance) => ({
  async create(data: MediaPerm): Promise<MediaPerm> {
    const response = await axios.post<MediaPerm>(BASE_URL, data.toApiInput())
    return MediaPerm.fromApi(response.data)
  },
  delete(id: number): Promise<AxiosResponse> {
    return axios.delete<void>(combineURLs(BASE_URL, String(id)), {})
  },
  async get(id: number): Promise<MediaPerm> {
    const response = await axios.get<MediaPerm>(combineURLs(BASE_URL, String(id)), {})
    return MediaPerm.fromApi(response.data)
  },
  async list(): Promise<MediaPerm[]> {
    const response = await axios.get<MediaPerm[]>(BASE_URL, {})
    return response.data.map(item => MediaPerm.fromApi(item))
  },
  async listByMedia(mediaId: string): Promise<MediaPerm[]> {
    const response = await axios.get<MediaPerm[]>(BASE_URL, { params: { media_id: mediaId } })
    return response.data.map(item => MediaPerm.fromApi(item))
  },
  async update(mediaPerm: MediaPerm): Promise<AxiosResponse> {
    return await axios.put<void>(combineURLs(BASE_URL, String(mediaPerm.id)), mediaPerm.toApiInput())
  }
})