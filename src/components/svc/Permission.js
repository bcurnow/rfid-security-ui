import api from './Base.js'
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
  get: function(id) {
    return api.get(combineURLs(BASE_URL, String(id)), {})
  },
  list: function() {
    return api.get(BASE_URL, {})
  },
  update: function(id, name, desc) {
    return api.put(combineURLs(BASE_URL, String(id)), {
      name: name,
      desc: desc,
    })
  }
}

export default svc
