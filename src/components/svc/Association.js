import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/association'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(data) {
    let url = combineURLs(BASE_URL, 'media')
    url = combineURLs(url, data.media_id)
    url = combineURLs(url, 'perm')
    url = combineURLs(url, data.perm_name)
    return api.delete(url, {})
  },
  get: function(pk) {
    let url = combineURLs(BASE_URL, 'media')
    url = combineURLs(url, String(pk))
    return api.get(url, {})
  },
  list: function() {
    return api.get(BASE_URL, {})
  },
}

export default svc
