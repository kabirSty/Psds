<!-- =========================================================================================
    File Name: Register.vue
    Description: Register Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row no-gutter">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/register.jpg" alt="register" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
                            <div class="px-8 pt-8 register-tabs-container">
                                <div class="vx-card__title mb-4">
                                    <h4 class="mb-4">Create Account</h4>
                                    <p>Fill the below form to create a new account.</p>
                                </div>
                                <div class="clearfix">
                                  <vs-input
                                    v-validate="'required|alpha_dash|min:3'"
                                    data-vv-validate-on="blur"
                                    label-placeholder="First Name"
                                    name="first_name"
                                    placeholder="First Name"
                                    v-model="first_name"
                                    class="w-full" />
                                  <span class="text-danger text-sm">{{ errors.first('first_name') }}</span>

                                  <vs-input
                                    v-validate="'required|alpha_dash|min:3'"
                                    data-vv-validate-on="blur"
                                    label-placeholder="Last Name"
                                    name="last_name"
                                    placeholder="Last Name"
                                    v-model="last_name"
                                    class="w-full" />
                                  <span class="text-danger text-sm">{{ errors.first('last_name') }}</span>

                                  <vs-input
                                    v-validate="'required|email'"
                                    data-vv-validate-on="blur"
                                    name="email"
                                    type="email"
                                    label-placeholder="Email"
                                    placeholder="Email"
                                    v-model="email"
                                    class="w-full mt-6" />
                                  <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                                  <vs-input
                                    ref="password"
                                    type="password"
                                    data-vv-validate-on="blur"
                                    v-validate="'required|min:6|max:50'"
                                    name="password"
                                    label-placeholder="Password"
                                    placeholder="Password"
                                    v-model="password"
                                    class="w-full mt-6" />
                                  <span class="text-danger text-sm">{{ errors.first('password') }}</span>


                                  <ul class="demo-alignment">
                                    <li>
                                        <vs-radio v-model="selectedRole" vs-value="4">Guest User</vs-radio>
                                    </li>
                                    <li>
                                        <vs-radio v-model="selectedRole" vs-value="2">Admin</vs-radio>
                                    </li>
                                  </ul>

                                  <vs-checkbox v-model="isTermsConditionAccepted" class="mt-6">I accept the terms & conditions.</vs-checkbox>
                                  <vs-button  type="border" to="/login" class="mt-6">Login</vs-button>
                                  <vs-button class="float-right mt-6" @click="registerUserJWt" :disabled="!validateForm">Register</vs-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
          selectedRole: 4,
          rolesArray: [
            { text: 'Guest User', value: 4 },
            { text: 'Admin', value: 2 },
          ],
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          isTermsConditionAccepted: false
        }
    },
    computed: {
        validateForm() {
            return this.first_name != '' && this.last_name != '' && this.email != '' && this.password != '' && this.isTermsConditionAccepted === true;
        }
    },
    methods: {
        checkLogin() {
          // If user is already logged in notify
          if(this.$store.state.auth.isUserLoggedIn()) {

            // Close animation if passed as payload
            // this.$vs.loading.close()

            this.$vs.notify({
              title: 'Login Attempt',
              text: 'You are already logged in!',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'warning'
            })


            return false
          }
          return true
        },
        registerUserJWt() {
          // If form is not validated or user is already login return
          if (!this.validateForm || !this.checkLogin()) return

            var self = this
            this.$vs.loading()
            const payload = {
                userDetails: {
                  first_name: this.first_name,
                  last_name: this.last_name,
                  email: this.email,
                  password: this.password,
                  role : this.selectedRole,
                },
                notify: this.$vs.notify
            }
          this.$store.dispatch('auth/registerUserJWT', payload)
            .then(() => { 
              this.$vs.loading.close() 
              this.$router.push('/dashboard').catch(() => {})
            })
            .catch(err => {
                if(err.status && err.status == 422){
                    Object.keys(err.data).forEach(function(key) {
                      self.errors.add({
                        field: key,
                        msg: err.data[key][0],
                      });
                    });
                }

              this.$vs.loading.close()
              // this.$vs.notify({
              //   title: 'Error',
              //   text: error.message,
              //   iconPack: 'feather',
              //   icon: 'icon-alert-circle',
              //   color: 'danger'
              // })
            })
        }
    }
}
</script>

<style lang="scss">
.register-tabs-container {
  min-height: 517px;

  .con-tab {
    padding-bottom: 23px;
  }
}
</style>
