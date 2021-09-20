import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/sounds'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(pk) {
    return api.delete(combineURLs(BASE_URL, pk), {})
  },
  get: function(pk) {
    return api.get(combineURLs(BASE_URL, pk), {})
  },
  list: function() {
    return api.get(BASE_URL, {})
  },
  update: function(id, data) {
    return api.put(combineURLs(BASE_URL, id.toString()), data)
  }
}

export default svc
