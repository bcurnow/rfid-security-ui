import axios, { type AxiosResponse } from 'axios'
import api from './Base.js'

const BASE_URL = '/reader'

const svc = {
  getUid(): Promise<AxiosResponse> {
    return api.get(BASE_URL, {})
  },
}

export default svc
