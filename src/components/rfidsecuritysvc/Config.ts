import axios, { type AxiosResponse } from 'axios'
import api, { combineURLs } from './Base'
import Config, { type ConfigSpec } from '@/components/model/Config'

const BASE_URL = '/configs'

const svc = {
  create(data: ConfigSpec): Promise<AxiosResponse> {
    return api.post<void>(BASE_URL, data)
  },

  delete(key: string): Promise<AxiosResponse> {
    return api.delete<void>(combineURLs(BASE_URL, key))
  },

  async get(key: string): Promise<Config> {
    const response = await api.get<ConfigSpec>(combineURLs(BASE_URL, key))
    return new Config(response.data)
  },

  async list(): Promise<Config[]> {
    const response = await api.get<ConfigSpec[]>(BASE_URL)
    return response.data.map(item => new Config(item))
  },

  update(key: string, value: string): Promise<AxiosResponse> {
    return api.put<void>(combineURLs(BASE_URL, key), { value })
  },
}

export default svc