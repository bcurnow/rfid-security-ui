import { AxiosInstance } from 'axios'

const BASE_URL = '/reader'

export const readerSvc = (axios: AxiosInstance) => ({
  getUid(): Promise<string> {
    if (import.meta.env.MODE === 'development') {
      return Promise.resolve("000000")
    }
    return axios.get<string>(BASE_URL).then(response => response.data)
  },
})