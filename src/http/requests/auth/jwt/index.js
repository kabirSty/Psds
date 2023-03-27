import axios from "../../../axios/index.js"
import store from "../../../../store/store.js"

// Token Refresh
let isAlreadyFetchingAccessToken = false
let subscribers = []

function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter(callback => callback(access_token))
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

export default {
  init() {

    var token = localStorage.getItem("accessToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      // const { config, response: { status } } = error
      const { config, response } = error
      const originalRequest = config

      // if (status === 401) {
      if (response && response.status === 401) {
        this.$router.push("/login");
      }
      return Promise.reject(error)
    })
  },
  login(email, pwd) {
    return axios.post("/api/auth/login", {email : email, password : pwd})
  },
  registerUser(first_name, last_name, email, pwd, role) {
    return axios.post("/api/auth/signup", {first_name:first_name, last_name:last_name, email: email, password: pwd, role : role})
  },
  forgotPassword(email, redirect_url) {
    return axios.post("/api/auth/recovery", {email: email, redirect_url : redirect_url})
  }, 
  checkResetPassword(email, token) {
    return axios.post("/api/auth/checkResetPasswordToken", {email: email, token : token})
  },
  resetPassword(email , token, password) {
    return axios.post("/api/auth/reset", {email:email, token:token, password: password, password_confirmation : password})
  }, 
}
