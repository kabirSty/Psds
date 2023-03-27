import axios from "@/axios.js"

export default {
  createCategory({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createCategory", data)
        .then((response) => {
          commit('ADD_CATEGORIES', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateCategory({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateCategory", data)
        .then((response) => {
          commit('UPDATE_CATEGORY', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewCategory({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewCategory", data)
        .then((response) => {
          commit('SET_CATEGORIES', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewCategoryWithoutPaginate({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewCategory", data)
        .then((response) => {
          commit('SET_CATEGORIES', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteCategory({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteCategory", data)
        .then((response) => {
          commit('DELETE_CATEGORY', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  ////////////////////////
  createGroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createGroup", data)
        .then((response) => {
          commit('ADD_GROUPS', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateGroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateGroup", data)
        .then((response) => {
          commit('UPDATE_GROUP', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewGroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewGroup", data)
        .then((response) => {
          commit('SET_GROUPS', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewGroupWithoutPaginate({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewGroup", data)
        .then((response) => {
          commit('SET_GROUPS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteGroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteGroup", data)
        .then((response) => {
          commit('DELETE_GROUP', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  ////////////////////////
  createContact({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createContact", data)
        .then((response) => {
          commit('ADD_CONTACTS', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewContacts({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewContact", data)
        .then((response) => {
          commit('SET_CONTACTS', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateContact({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateContact", data)
        .then((response) => {
          commit('UPDATE_CONTACTS', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteContact({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteContact", data)
        .then((response) => {
          commit('DELETE_CONTACT', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  ////////////////////////////////
  viewACompany({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewCompany", data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createCompany({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createCompany", data)
        .then((response) => {
          commit('ADD_COMPANY', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updateCompany({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateCompany", data)
        .then((response) => {
          commit('UPDATE_COMPANY', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  deleteCompany({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteCompany", data)
        .then((response) => {
          commit('DELETE_COMPANY', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  ///////////////////////////////////////
  viewApp({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewApp", data)
        .then((response) => {
          commit('SET_APP', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createApp({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createApp", data)
        .then((response) => {
          commit('ADD_APP', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updateApp({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateApp", data)
        .then((response) => {
          commit('UPDATE_APP', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  deleteApp({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteApp", data)
        .then((response) => {
          commit('DELETE_APP', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
   ///////////////////////////////////////
  viewTranslation({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewTranslation", data)
        .then((response) => {
          commit('SET_TRANSLATION', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createTranslation({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createTranslation", data)
        .then((response) => {
          commit('ADD_TRANSLATION', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updateTranslation({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateTranslation", data)
        .then((response) => {
          commit('UPDATE_TRANSLATION', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  deleteTranslation({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteTranslation", data)
        .then((response) => {
          commit('DELETE_TRANSLATION', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
   ///////////////////////////////////////
  viewTerm({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewTerm", data)
        .then((response) => {
          commit('SET_TERM', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createTerm({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createTerm", data)
        .then((response) => {
          commit('ADD_TERM', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updateTerm({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateTerm", data)
        .then((response) => {
          commit('UPDATE_TERM', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  deleteTerm({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteTerm", data)
        .then((response) => {
          commit('DELETE_TERM', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
   ///////////////////////////////////////
  viewLanguage({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewLanguage", data)
        .then((response) => {
          commit('SET_LANGUAGE', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createLanguage({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createLanguage", data)
        .then((response) => {
          commit('ADD_LANGUAGE', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updateLanguage({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateLanguage", data)
        .then((response) => {
          commit('UPDATE_LANGUAGE', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  deleteLanguage({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteLanguage", data)
        .then((response) => {
          commit('DELETE_LANGUAGE', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  ///////////////////////////////////////
  viewPlace({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewPlace", data)
        .then((response) => {
          commit('SET_PLACE', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createPlace({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createPlace", data)
        .then((response) => {
          commit('ADD_PLACE', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updatePlace({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updatePlace", data)
        .then((response) => {
          commit('UPDATE_PLACE', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deletePlace({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deletePlace", data)
        .then((response) => {
          commit('DELETE_PLACE', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  ///////////////////////////////////////
  viewFilter({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewFilter", data)
        .then((response) => {
          commit('SET_FILTER', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  viewFilterWithoutPaginate({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/viewFilter", data)
        .then((response) => {
          commit('SET_FILTER', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createFilter({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/createFilter", data)
        .then((response) => {
          commit('ADD_FILTER', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  updateFilter({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/updateFilter", data)
        .then((response) => {
          commit('UPDATE_FILTER', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error.response) })
    })
  },
  deleteFilter({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("/api/deleteFilter", data)
        .then((response) => {
          commit('DELETE_FILTER', data.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
}
