import api from './Base.js'
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
  get: function(key) {
    return api.get(combineURLs(BASE_URL, key), {})
  },
  list: function() {
    return api.get(BASE_URL, {})
  },
  update: function(key, value) {
    return api.put(combineURLs(BASE_URL, key), {
      value: value,
    })
  }
}

export default svc
