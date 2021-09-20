import config from '@/config'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = combineURLs(config.apiUrl, '/player')

const svc = {
  url: function(name) {
    return combineURLs(BASE_URL, name)
  }
}

export default svc
