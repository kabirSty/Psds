<template>
  <vx-card no-shadow>
    <div id="editPasswordLoadingDiv" class="vs-con-loading__container">
      <form>
        <!-- Info -->
        <div class="vx-row mt-2">
          <div class="vx-col sm:w-full w-full mb-4">
            <vs-input type="password" v-validate="'required|min:6'" name="old_password" ref="old_password" class="w-full" label-placeholder="Old Password" v-model="old_password"></vs-input>
            <span class="text-danger text-sm" v-show="errors.has('old_password')">{{ errors.first('old_password') }}</span>
          </div>
        </div>

        <div class="vx-row">
          <div class="vx-col sm:w-full w-full mb-4">
            <vs-input type="password" v-validate="'required|min:6'" name="new_password" ref="new_password" class="w-full" label-placeholder="New Password" v-model="new_password"></vs-input>
            <span class="text-danger text-sm" v-show="errors.has('new_password')">{{ errors.first('new_password') }}</span>
          </div>
        </div>

        <div class="vx-row">
          <div class="vx-col sm:w-full w-full mb-4">
            <vs-input type="password" v-validate="'required|min:6|confirmed:new_password'" name="confirm_new_password" ref="confirm_new_password" class="w-full" label-placeholder="Confirm New Password" v-model="confirm_new_password"></vs-input>
            <span class="text-danger text-sm" v-show="errors.has('confirm_new_password')">{{ errors.first('confirm_new_password') }}</span>
          </div>
        </div>

        <!-- Save & Reset Button -->
        <div class="flex flex-wrap items-center justify-end">
          <vs-button @click="validatePasswordData" class="ml-auto mt-2">Save Changes</vs-button>
        </div>
      </form>
    </div>
  </vx-card>
</template>

<script>
import moduleRoleManagement from '@/store/role-management/moduleRoleManagement.js'

export default {
  data() {
    return {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    },
  },
  methods: {
    validatePasswordData() {
      this.$validator.validateAll().then(result => {
        if (result) this.updatePassword()
      })
    },
    updatePassword() {
      var self = this

      this.$vs.loading({
        container: '#editPasswordLoadingDiv',
        scale: 0.6
      })

      let userData = {
        old_password : this.old_password,
        new_password : this.new_password,
      }

      this.$store.dispatch("roleManagement/updatePassword", userData)
        .then(res => { 
            this.$vs.loading.close('#editPasswordLoadingDiv > .con-vs-loading')

            this.old_password = ''
            this.new_password = ''
            this.confirm_new_password = ''

            this.$vs.notify({
                title: "Success.",
                text: "Password updated successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
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

          this.$vs.loading.close('#editPasswordLoadingDiv > .con-vs-loading')
        })
    },
  },
  created() {
    // Register Module UserManagement Module
    if(!moduleRoleManagement.isRegistered) {
      this.$store.registerModule('roleManagement', moduleRoleManagement)
      moduleRoleManagement.isRegistered = true
    }
  }
}
</script>
