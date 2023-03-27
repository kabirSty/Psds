export default {
  SET_ROLES(state, roles) {
    state.roles = roles
  },
  SET_USERS(state, users) {
    state.users = users
  },
  SET_USERS_COUNT(state, users_count) {
    state.users_count = users_count
  },
  ADD_USER(state, user) {
    state.users.push(Object.assign({}, user))
  },
  REMOVE_USER(state, user_id) {
    const ItemIndex = state.users.findIndex((p) => p.id == user_id)
    state.users.splice(ItemIndex, 1)
    state.users_count = state.users.count
  },
}
