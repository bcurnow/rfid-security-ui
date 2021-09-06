import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    listDetailShared: {
      item: null,
      newItem: false,
    }
  },
  mutations: {
    updateListDetailShared: (state, sharedState) => {
      state.listDetailShared = sharedState
    }
  },
  actions: {
  },
  modules: {
  }
})
