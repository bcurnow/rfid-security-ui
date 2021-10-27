import api from "./Base"
import {Sound} from "../model"
import combineURLs from "axios/lib/helpers/combineURLs.js"

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
