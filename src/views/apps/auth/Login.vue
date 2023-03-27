<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">

          <div class="vx-row no-gutter justify-center items-center">

            <div class="vx-col hidden lg:block lg:w-1/2 justify-center items-center">
              <!-- <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto"> -->
              <h2 class="mx-auto py-3 pl-3 text-center text-primary">Citi<span style="color: #10163a;">Guide</span></h2>
            </div>

            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg" style="background: #10163a;">
              <div class="px-8 pt-8 login-tabs-container">
 
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4 text-white">Login</h4>
                  <p class="text-white">Welcome back, please login to your account.</p>
                </div>
                
                <div class="pt-8">
                  <vs-input
                      v-validate="'required|email|min:3'"
                      data-vv-validate-on="blur"
                      name="email"
                      icon-no-border
                      icon="icon icon-user"
                      icon-pack="feather"
                      label-placeholder="Email"
                      v-model="email"
                      class="w-full"/>
                  <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                  <vs-input
                      data-vv-validate-on="blur"
                      v-validate="'required|min:6|max:10'"
                      type="password"
                      name="password"
                      icon-no-border
                      icon="icon icon-lock"
                      icon-pack="feather"
                      label-placeholder="Password"
                      v-model="password"
                      class="w-full mt-6" />
                  <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                  <div class="flex flex-wrap justify-between my-5">
                      <router-link to="/forgot-password">Forgot Password?</router-link>
                  </div>
                  <div class="flex flex-wrap  mb-3 justify-end">
                    <!-- <vs-button  type="border" @click="registerUser">Register</vs-button> -->
                    <vs-button :disabled="!validateForm" @click="loginJWT">Login</vs-button>
                  </div>
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
  components: {

  },
  data() {
    return {
      email: '',
      password: '',
      checkbox_remember_me: false
    }
  },
  created() {
    this.checkLoginWhenStart()
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.email != '' && this.password != '';
    },
  },
  methods: {
    checkLoginWhenStart() {
      let tokenExpiry = localStorage.getItem("tokenExpiry")
      let user = JSON.parse(localStorage.getItem("userInfo"))

      if(tokenExpiry && user){
        var tokenExpiryTime = new Date(tokenExpiry);

        if (tokenExpiryTime > new Date()) {
          this.$router.push("/dashboard");
        }
      }
    },
    checkLogin() {
      // If user is already logged in notify
      if (this.$store.state.auth.isUserLoggedIn()) {
        // Close animation if passed as payload
        // this.$vs.loading.close()
        this.$router.push('/dashboard').catch(() => {})
        
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
    loginJWT() {

      if (!this.checkLogin()) return

      // Loading
      this.$vs.loading()

      const payload = {
        checkbox_remember_me: this.checkbox_remember_me,
        userDetails: {
          email: this.email,
          password: this.password
        }
      }

      this.$store.dispatch('auth/loginJWT', payload)
        .then(() => { 
          this.$vs.loading.close() 
          this.$router.push('/dashboard').catch(() => {})
        })
        .catch(error => {
          this.$vs.loading.close()
          this.$vs.notify({
            title: 'Error',
            text: error.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        })
    },
    registerUser() {
      if (!this.checkLogin()) return
      this.$router.push('/register').catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.login-tabs-container {
  min-height: 505px;

  .con-tab {
    padding-bottom: 14px;
  }

  .con-slot-tabs {
    margin-top: 1rem;
  }
}
</style>
