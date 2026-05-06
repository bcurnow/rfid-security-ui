import { type AxiosInstance, AxiosResponse } from 'axios'
import { Media } from '@/components/model'
import { combineURLs } from '@/composables/useAxios';

const BASE_URL = '/media'

export const mediaSvc = (axios: AxiosInstance) => ({
  async create(data: Media): Promise<Media> {
    const response = await axios.post<Media>(BASE_URL, data.toApiInput())
    return Media.fromApi(response.data)
  },
  delete(id: string): Promise<AxiosResponse> {
    return axios.delete<void>(combineURLs(BASE_URL, id))
  },
  async get(id: string): Promise<Media> {
    const response = await axios.get<Media>(combineURLs(BASE_URL, id))
    return Media.fromApi(response.data)
  },
  async list(): Promise<Media[]> {
    const response = await axios.get<Media[]>(BASE_URL)
    return response.data.map(item => Media.fromApi(item))
  },
  async listUnassociated(): Promise<Media[]> {
    const response = await axios.get<Media[]>(BASE_URL, { params: { exclude_associated: true } })
    return response.data.map(item => Media.fromApi(item))
  },
  async update(media: Media): Promise<AxiosResponse> {
    return axios.put<void>(combineURLs(BASE_URL, media.id), media.toApiInput())
  },
})