import api from './Base'
import {Permission} from '@/components/model'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/permissions'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(id) {
    return api.delete(combineURLs(BASE_URL, String(id)), {})
  },
  get: async function(id) {
    const response = await api.get(combineURLs(BASE_URL, id), {})
    return new Permission(response.data)
  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new Permission(api))
  },
  update: function(id, name, desc) {
    return api.put(combineURLs(BASE_URL, String(id)), {
      name: name,
      desc: desc,
    })
  }
}

export default svc
