import api from './Base.js'
import {BaseModel} from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

export class Sound extends BaseModel {
  static type = 'Sound'
  static primaryKey = 'id'

  constructor(api) {
    super()
    this.id = api.id
    this.name = api.name
    this.lastUpdateTimestamp = api.last_update_timestamp
    this.content = api.content
  }
}

const BASE_URL = '/sounds'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(id) {
    return api.delete(combineURLs(BASE_URL, String(id)), {})
  },
  get: async function(id) {
    const response = await api.get(combineURLs(BASE_URL, String(id)), {})
    return new Sound(response.data)
  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new Sound(api))
  },
  update: function(id, data) {
    return api.put(combineURLs(BASE_URL, id.toString()), data)
  }
}

export default svc
