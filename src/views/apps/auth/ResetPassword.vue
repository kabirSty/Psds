<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col sm:w-3/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div id="resetPasswordLoadingDiv" class="vs-con-loading__container">
                    <div slot="no-body" class="full-page-bg-color">
                        <div class="vx-row">
                            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                                <img src="@/assets/images/pages/reset-password.png" alt="login" class="mx-auto">
                            </div>
                            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
                                <div class="p-8">
                                    <div class="vx-card__title mb-8">
                                        <h4 class="mb-4">Reset Password</h4>
                                        <p>Please enter your new password.</p>
                                    </div>
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
                                        v-validate="'required|min:6|max:10'"
                                        name="password"
                                        label-placeholder="Password"
                                        placeholder="Password"
                                        v-model="password"
                                        class="w-full mt-6" />
                                    <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                                    <vs-input
                                        ref="confirm_password"
                                        type="password"
                                        data-vv-validate-on="blur"
                                        v-validate="'required|confirmed:password|min:6|max:10'"
                                        name="confirm_password"
                                        label-placeholder="Confirm Password"
                                        placeholder="Confirm Password"
                                        v-model="confirm_password"
                                        class="w-full mt-6" />
                                    <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>

                                    <div class="mt-6 flex flex-wrap justify-between flex-col-reverse sm:flex-row">
                                        <vs-button type="border" to="/login" class="w-full sm:w-auto mb-8 sm:mb-auto mt-3 sm:mt-auto">Go Back To Login</vs-button>
                                        <vs-button class="w-full sm:w-auto" :disabled="!validateForm" @click="resetPassword">Reset</vs-button>
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
    data() {
        return {
            email: '',
            password: '',
            confirm_password: '',
        }
    },
    computed: {
        validateForm() {
            return !this.errors.any() && this.email != '' && this.password != '' && this.confirm_password  != '';
        }
    },
    mounted() {
        this.checkTokenIsValid();
    },

    methods: {
        checkTokenIsValid() {
            this.$vs.loading({
                container: '#resetPasswordLoadingDiv',
                scale: 0.6
            })

            this.email = this.$route.query.email;

            const payload = {
                userDetails: {
                    token : this.$route.params.token,
                    email : this.$route.query.email,
                }
            }

            this.$store.dispatch('auth/checkResetPasswordJWT', payload)
                .then(() => { 
                  this.$vs.loading.close('#resetPasswordLoadingDiv > .con-vs-loading')
                })
                .catch(error => {
                    this.$vs.loading.close('#resetPasswordLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: 'Error',
                        text: error.message,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },
        resetPassword() {
            this.$vs.loading({
                container: '#resetPasswordLoadingDiv',
                scale: 0.6
            })

            const payload = {
                userDetails: {
                  token : this.$route.params.token,
                  email: this.email,
                  password: this.password,
                }
            }


            this.$store.dispatch('auth/resetPasswordJWT', payload)
                .then(() => { 
                  this.$vs.loading.close('#resetPasswordLoadingDiv > .con-vs-loading')

                  this.$vs.notify({
                    title: 'Success',
                    text: 'Password successfully updated. Please login.',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                  })

                  this.$router.push('login').catch(() => {})

                })
                .catch(error => {
                  this.$vs.loading.close('#resetPasswordLoadingDiv > .con-vs-loading')
                  this.$vs.notify({
                    title: 'Error',
                    text: error.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                  })
                })
        },
    },
    created() {
       

    },
}
</script>
