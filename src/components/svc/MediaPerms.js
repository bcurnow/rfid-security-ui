import api from "./Base"
import {MediaPerm} from "../model"
import combineURLs from "axios/lib/helpers/combineURLs.js"

const BASE_URL = '/media-perms'

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
    return new MediaPerm(response.data)
  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new MediaPerm(api))
  },
  listByMedia: function(mediaId) {
    return api.get(BASE_URL, { params: { media_id: mediaId } })
  },
}

export default svc
