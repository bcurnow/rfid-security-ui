import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/permissions'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
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
  update: function(pk, name, desc) {
    return api.put(combineURLs(BASE_URL, String(name)), {
      desc: desc,
    })
  }
}

export default svc
