import { type AxiosResponse, AxiosInstance} from 'axios'

const BASE_URL = '/reader'

export const readerSvc = (axios: AxiosInstance) => ({
  getUid(): Promise<string> {
    // Override the return so when in dev mode
    if ( import.meta.env.MODE === 'development' ) {
      return Promise.resolve("000000")
    }
    return axios.get(BASE_URL, {})
  },
})