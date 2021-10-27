import api from './Base.js'
import {BaseModel} from './Base.js'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

export class Media extends BaseModel {
  static type = 'Media'
  static primaryKey = 'name'

  constructor(api) {
    super()
    this.id = api.id
    this.name = api.name
    this.desc = api.desc
  }

  displayIdentifier() {
    return `${this.name}  (${this.id})`
  }
}

const BASE_URL = '/media'

const svc = {
  api: api,
  create: function(data) {
    return api.post(BASE_URL, data)
  },
  delete: function(id) {
    return api.delete(combineURLs(BASE_URL, id), {})
  },
  get: async function(id) {
    const response = await api.get(combineURLs(BASE_URL, id), {})
    return new Media(response.data)
  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new Media(api))
  },
  update: function(id, name, desc) {
    return api.put(combineURLs(BASE_URL, id), {
      name: name,
      desc: desc,
    })
  }
}

export default svc
