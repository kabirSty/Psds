import state from './moduleRoleManagementState.js'
import mutations from './moduleRoleManagementMutations.js'
import actions from './moduleRoleManagementActions.js'
import getters from './moduleRoleManagementGetters.js'

export default {
  isRegistered: false,
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

