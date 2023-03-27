import axios from "@/axios.js"

export default {
  viewRole({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewRole")
        .then((response) => {
          commit('SET_ROLES', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateRole({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateRole", data)
        .then((response) => {
          // commit('SET_ROLES', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  assignDetachPermission({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/assignDetachPermission", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },


  assignUsers({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/assignUsers", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewUser", data)
        .then((response) => {
          commit('SET_USERS', response.data.data)
          commit('SET_USERS_COUNT', response.data.total)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewRoleUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewUser", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewAUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewUser", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createUser", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updateUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateUser", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updateUserStatus({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateUserStatus", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { 
          reject(error.response) 
        })
    })
  },
  updateProfile({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateProfile", data)
        .then((response) => {
          commit('UPDATE_USER_INFO', response.data.user, {root: true})
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  deleteUser({ commit }, user_id) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteUser", {id : user_id})
        .then((response) => {
          commit('REMOVE_USER', user_id)
          resolve(response)
        })
        .catch((error) => { 
          reject(error.response) 
        })
    })
  },
  updatePassword({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/changePassword", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { 
          reject(error.response) 
        })
    })
  },
}
