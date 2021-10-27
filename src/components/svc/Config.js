import api from './Base.js'
import {BaseModel} from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

export class Config extends BaseModel {
  static type = 'Config'
  static primaryKey = 'key'

  constructor(api) {
    super()
    this.key = api.key
    this.value = api.value
  }

  isControllable() {
    if (this.key === 'ADMIN_API_KEY') {
      return false
    }
    return true
  }
}

const BASE_URL = '/configs'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(key) {
    return api.delete(combineURLs(BASE_URL, key), {})
  },
  get: async function(key) {
    const response = await api.get(combineURLs(BASE_URL, key), {})
    return new Config(response.data)
  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new Config(api))
  },
  update: function(key, value) {
    return api.put(combineURLs(BASE_URL, key), {
      value: value,
    })
  }
}

export default svc
