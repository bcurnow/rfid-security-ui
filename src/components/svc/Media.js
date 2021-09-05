import api from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const mediaSvc = {
  api: api,
  list: function() {
    return api.get('/media', {})
  },
  get: function(id) {
    return api.get(combineURLs('/media', id), {})
  },
}

export default mediaSvc
