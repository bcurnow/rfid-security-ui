import api from './Base'
import {Config} from '@/components/model'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/configs'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(key) {
    return api.delete(combineURLs(BASE_URL, key), {})
  },
  get: async function(key) {
    const response = await api.get(combineURLs(BASE_URL, key), {})
    return new Config(response.data)
  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new Config(api))
  },
  update: function(key, value) {
    return api.put(combineURLs(BASE_URL, key), {
      value: value,
    })
  }
}

export default svc
