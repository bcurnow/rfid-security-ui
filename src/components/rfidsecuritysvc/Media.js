import api from "./Base"
import {Media} from "@/components/model"
import combineURLs from "axios/lib/helpers/combineURLs.js"

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
