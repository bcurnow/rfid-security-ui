import api from './Base'
import {GuestMedia} from '@/components/model'
import combineURLs from 'axios/lib/helpers/combineURLs.js'

const BASE_URL = '/guest-media'

const svc = {
  api: api,
  create: function(guestId, mediaId, sound, color) {
    return api.post(BASE_URL, {
      guest_id: parseInt(guestId),
      media_id: mediaId,
      sound_id: sound,
      color: color,
    })
  },
  delete: function(id) {
    return api.delete(combineURLs(BASE_URL, String(id)), {})
  },
  get: async function(id) {
    const response = await api.get(combineURLs(BASE_URL, String(id)), {})
    return new GuestMedia(response.data)
  },
  list: async function() {
    const response = await api.get(BASE_URL, {})
    return response.data.map(api => new GuestMedia(api))
  },
  listByGuest: async function(guestId) {
    const response = await api.get(BASE_URL, { params: { guest_id: guestId } })
    return response.data.map(api => new GuestMedia(api))
  },
  update: function(id, guestId, mediaId, sound, color) {
    console.log(`id: ${id}, guestId: ${guestId}, mediaId: ${mediaId}, sound: ${sound}, color: ${color}`)
    return api.put(combineURLs(BASE_URL, String(id)), {
      guest_id: parseInt(guestId),
      media_id: mediaId,
      sound: sound,
      color: color,
    })
  }
}

export default svc
