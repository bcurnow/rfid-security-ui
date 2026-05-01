import { AxiosInstance, type AxiosResponse } from 'axios'
import { Config } from '@/components/model'
import { combineURLs } from '@/composables/useAxios';

const BASE_URL = '/configs'

export const configSvc = (axios: AxiosInstance) => ({
  async create(data: Config ): Promise<Config> {
    const response = await axios.post<Config>(BASE_URL, data.toApiInput())
    return Config.fromApi(response.data)
  },

  delete(key: string): Promise<AxiosResponse> {
    return axios.delete<void>(combineURLs(BASE_URL, key))
  },

  async get(key: string): Promise<Config> {
    const response = await axios.get<Config>(combineURLs(BASE_URL, key))
    return Config.fromApi(response.data)
  },

  async list(): Promise<Config[]> {
    const response = await axios.get<Config[]>(BASE_URL)
    return response.data.map(item => Config.fromApi(item))
  },

  update(config: Config): Promise<AxiosResponse> {
    return axios.put<void>(combineURLs(BASE_URL, config.key), config.toApiInput())
  },
})