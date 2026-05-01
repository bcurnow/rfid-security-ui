import config from '@/config'
import { combineURLs } from '@/composables/useAxios';

const BASE_URL = '/player'

export const playerSvc = {
  url(name: string): string {
    return combineURLs(config.apiUrl, combineURLs(BASE_URL, name))
  }
}

export default playerSvc
