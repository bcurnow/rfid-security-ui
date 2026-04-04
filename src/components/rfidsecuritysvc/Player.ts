import axios, { type AxiosResponse } from 'axios'
import config from '@/config'
import { combineURLs } from './Base'
import { st } from 'vue-router/dist/router-CWoNjPRp.mjs'

const BASE_URL = '/player'

const svc = {
  url(name: string): string {
    return combineURLs(BASE_URL, name)
  }
}

export default svc
