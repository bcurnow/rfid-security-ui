import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/associations'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(data) {
    let url = combineURLs(BASE_URL, data.media_id)
    url = combineURLs(url, data.perm_name)
    return api.delete(url, {})
  },
  get: function(pk) {
    return api.get(combineURLs(BASE_URL, String(pk)), {})
  },
  list: function() {
    return api.get(BASE_URL, {})
  },
}

export default svc
