import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/guests'

const svc = {
  api: api,
  create: function(first_name, last_name, sound, color) {
    return api.post(BASE_URL, {
      first_name: first_name,
      last_name: last_name,
      sound: sound,
      color: color,
    })
  },
  delete: function(pk) {
    return api.delete(combineURLs(BASE_URL, String(pk)), {})
  },
  get: function(pk) {
    return api.get(combineURLs(BASE_URL, String(pk)), {})
  },
  list: function() {
    return api.get(BASE_URL, {})
  },
  update: function(pk, first_name, last_name, sound, color) {
    return api.put(combineURLs(BASE_URL, String(pk)), {
      first_name: first_name,
      last_name: last_name,
      sound: sound,
      color: color,
    })
  }
}

export default svc
