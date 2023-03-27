<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div id="recoverPasswordLoadingDiv" class="vs-con-loading__container">
                    <div slot="no-body" class="full-page-bg-color">
                        <div class="vx-row">
                            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                                <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto">
                            </div>
                            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
                                <div class="p-8">
                                    <div class="vx-card__title mb-8">
                                        <h4 class="mb-4">Recover your password</h4>
                                        <p>Please enter your email address and we'll send you instructions on how to reset your password.</p>
                                    </div>

                                    <vs-input
                                        v-validate="'required|email|min:3'"
                                        name="email" 
                                        ref="email"
                                        data-vv-validate-on="blur"
                                        icon-no-border
                                        icon="icon icon-user"
                                        icon-pack="feather"
                                        label-placeholder="Email"
                                        v-model="email"
                                        class="w-full mb-8"/>
                                      
                                    <vs-button type="border" to="/login" class="px-4 w-full md:w-auto">Back To Login</vs-button>
                                    <vs-button :disabled="!validateForm"  @click="recoverPassword" class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0">Recover Password</vs-button>
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
            email: ''
        }
    },
    computed: {
        validateForm() {
            return !this.errors.any() && this.email != '';
        },
    },
    methods: {
        recoverPassword() {
            this.$vs.loading({
                container: '#recoverPasswordLoadingDiv',
                scale: 0.6
            })

            const payload = {
                userDetails: {
                  email: this.email,
                  redirect_url: window.location.protocol+'//'+window.location.host,
                }
              }


              this.$store.dispatch('auth/forgotPasswordJWT', payload)
                .then(() => { 
                  this.$vs.loading.close('#recoverPasswordLoadingDiv > .con-vs-loading')

                  this.$vs.notify({
                    title: 'Success',
                    text: 'Reset password link successfully send to your mail.',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                  })

                })
                .catch(error => {
                  this.$vs.loading.close('#recoverPasswordLoadingDiv > .con-vs-loading')
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

    }
}
</script>
