import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    breadcrumb: [] // 面包屑
  },
  mutations: {
    setToken (state, data) {
      this.state.token = data;
    },
    setBreadcrumb (state, data) {
      this.state.breadcrumb = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
