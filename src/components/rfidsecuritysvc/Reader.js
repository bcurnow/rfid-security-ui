import api from './Base.js'

const BASE_URL = '/reader'

const svc = {
  api: api,
  getUid: function() {
    return api.get(BASE_URL, {})
  },
}

export default svc
