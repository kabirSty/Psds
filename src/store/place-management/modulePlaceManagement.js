import state from './modulePlaceManagementState.js'
import mutations from './modulePlaceManagementMutations.js'
import actions from './modulePlaceManagementActions.js'
import getters from './modulePlaceManagementGetters.js'

export default {
  isRegistered: false,
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

