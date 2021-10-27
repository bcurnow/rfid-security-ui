import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'
import {Guest} from '@/components/model'
const BASE_URL = '/guests'

const svc = {
  api: api,
  create: function(firstName, lastName, sound, color) {
    return api.post(BASE_URL, {
      first_name: firstName,
      last_name: lastName,
      sound: sound,
      color: color,
    })
  },
  delete: function(id) {
    return api.delete(combineURLs(BASE_URL, String(id)), {})
  },
  get: async function(id) {
    const response = await api.get(combineURLs(BASE_URL, String(id)), {})
    return new Guest(response.data)
  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new Guest(api))
  },
  update: function(id, firstName, lastName, sound, color) {
    return api.put(combineURLs(BASE_URL, String(id)), {
      first_name: firstName,
      last_name: lastName,
      sound: sound,
      color: color,
    })
  }
}

export default svc
