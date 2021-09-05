import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const configSvc = {
  api: api,
  create: function(config) {
    return api.post('/config', config)
  },
  delete: function(key) {
    return api.delete(combineURLs('/config', key), {})
  },
  get: function(key) {
    return api.get(combineURLs('/config', key), {})
  },
  list: function() {
    return api.get('/config', {})
  },
  update: function(key, value) {
    return api.put(combineURLs('/config', key), {
      value: value,
    })
  }
}

export default configSvc
