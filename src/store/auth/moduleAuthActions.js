import jwt from "../../http/requests/auth/jwt/index.js"
import firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'

export default {
    loginJWT({ commit }, payload) {
        return new Promise((resolve,reject) => {
        jwt.login(payload.userDetails.email, payload.userDetails.password)
            .then(response => {
                // If there's user data in response
                if(response.data.user) {
                    // Set accessToken
                    localStorage.setItem("accessToken", response.data.token)

                    // Update user details
                    commit('UPDATE_USER_INFO', response.data.user, {root: true})

                    // Set bearer token in axios
                    commit("SET_BEARER", response.data.token)

                    var tokenExpiryHour = response.data.expires_in_minutes;
                    tokenExpiryHour = tokenExpiryHour/60;

                    var tokenExpiryTime = new Date();
                    tokenExpiryTime.setHours(tokenExpiryTime.getHours() + tokenExpiryHour);

                    localStorage.setItem('tokenExpiry', tokenExpiryTime);
                    resolve(response)
                }
                else reject({message: "Wrong Email or Password"})
            })
            .catch(error => { 
                reject(error) 
            })
      })
    },
    registerUserJWT({ commit }, payload) {
        const { first_name, last_name, email, password, role } = payload.userDetails
        return new Promise((resolve,reject) => {

        jwt.registerUser(first_name, last_name, email, password, role)
            .then(response => {
                // Redirect User
                // router.push(router.currentRoute.query.to || '/')

                // Update data in localStorage
                localStorage.setItem("accessToken", response.data.token)

                // Update user details
                commit('UPDATE_USER_INFO', response.data.user, {root: true})

                // Set bearer token in axios
                commit("SET_BEARER", response.data.token)

                var tokenExpiryHour = response.data.expires_in_minutes;
                tokenExpiryHour = tokenExpiryHour/60;
                tokenExpiryHour = localStorage.setItem('userData', tokenExpiryTime)

                var tokenExpiryTime = new Date();
                tokenExpiryTime.setHours(tokenExpiryTime.getHours() + tokenExpiryHour);

                localStorage.setItem('tokenExpiry', tokenExpiryTime);
                
                resolve(response)
            })
            .catch(error => { 
                reject(error.response) 
            })
        })
    },
    forgotPasswordJWT({ commit }, payload) {
        const { email , redirect_url} = payload.userDetails
        return new Promise((resolve,reject) => {

        jwt.forgotPassword(email, redirect_url)
            .then(response => {
                resolve(response)
            })
            .catch(error => { 
                reject(error.response) 
            })
        })
    },
    checkResetPasswordJWT({ commit }, payload) {
        const { email , token} = payload.userDetails
        return new Promise((resolve,reject) => {

        jwt.checkResetPassword(email, token)
            .then(response => {
                resolve(response)
            })
            .catch(error => { 
                reject(error.response) 
            })
        })
    },
    resetPasswordJWT({ commit }, payload) {
        const { email , token, password} = payload.userDetails
        return new Promise((resolve,reject) => {

        jwt.resetPassword(email, token, password)
            .then(response => {
                resolve(response)
            })
            .catch(error => { 
                reject(error.response) 
            })
        })
    },
}
