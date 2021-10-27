import api from './Base.js'
import {BaseModel} from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

export class Permission extends BaseModel {
  static type = 'Permission'
  static primaryKey = 'id'

  constructor(api) {
    super()
    this.id = api.id
    this.name = api.name
    this.desc = api.desc
  }
}

const BASE_URL = '/permissions'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(id) {
    return api.delete(combineURLs(BASE_URL, String(id)), {})
  },
  get: async function(id) {
    const response = await api.get(combineURLs(BASE_URL, id), {})
    return new Permission(response.data)  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new Permission(api))
  },
  update: function(id, name, desc) {
    return api.put(combineURLs(BASE_URL, String(id)), {
      name: name,
      desc: desc,
    })
  }
}

export default svc
