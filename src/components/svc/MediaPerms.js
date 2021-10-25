import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/media-perms'

const svc = {
  api: api,
  create: function(data) {
    /*
    if (data.permission_id == 1) {
      return new Promise(() => {
        throw new Error("Testing!")
      })
    }
    */
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
  listByMedia: function(mediaId) {
    return api.get(BASE_URL, { params: { media_id: mediaId } })
  },
}

export default svc
