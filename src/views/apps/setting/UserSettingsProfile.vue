<template>
  <vx-card no-shadow>
    <div id="editProfileLoadingDiv" class="vs-con-loading__container">
      <!-- Img Row -->
   <!--    <div class="flex flex-wrap items-center mb-base">
        <vs-avatar :src="activeUserInfo.image" size="70px" class="mr-4 mb-4" />
        <div>
          <vs-button class="mr-4 sm:mb-0 mb-2">Upload photo</vs-button>
          <p class="text-sm mt-2">Allowed JPG, GIF or PNG. Max size of 800kB</p>
        </div>
      </div> -->

      <!-- Info -->
      <div class="vx-row">
        <div class="vx-col sm:w-full w-full mb-5">
          <vs-input v-validate="'required|alpha_spaces'" name="first_name" ref="first_name" class="w-full" label-placeholder="First Name" v-model="activeUserInfo.first_name"></vs-input>
          <span class="text-danger text-sm" v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>
        </div>
      </div>

      <div class="vx-row">
        <div class="vx-col sm:w-full w-full mb-5">
          <vs-input v-validate="'required|alpha_spaces'" name="last_name" ref="last_name" class="w-full" label-placeholder="Last Name" v-model="activeUserInfo.last_name"></vs-input>
          <span class="text-danger text-sm" v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span>
        </div>
      </div>

      <div class="vx-row">
        <div class="vx-col sm:w-full w-full mb-5">
          <vs-input v-validate="'required|email'" name="email" ref="email" class="w-full" label-placeholder="Email" v-model="activeUserInfo.email"></vs-input>
          <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
        </div>
      </div>

      <!-- Save & Reset Button -->
      <div class="flex flex-wrap items-center justify-end">
        <vs-button @click="resetProfileData" class="ml-4 mt-2" type="border" color="warning">Reset</vs-button>
        <vs-button @click="validateProfileData" class="ml-4 mt-2">Save Changes</vs-button>
      </div>
    </div>
  </vx-card>
</template>

<script>
import moduleRoleManagement from '@/store/role-management/moduleRoleManagement.js'

export default {
  data() {
    return {
      activeUserInfo : JSON.parse(localStorage.getItem("userInfo")),
    }
  },
  methods: {
    validateProfileData() {
      this.$validator.validateAll().then(result => {
        if (result) this.updateProfile()
      })
    },
    selectAddressItem (payload, objectName) {
      this.oneLineAddress = payload.oneLineAddress
    },
    updateProfile() {
      var self = this
      
      this.$vs.loading({
        container: '#editProfileLoadingDiv',
        scale: 0.6
      })

      let userData = {
        first_name : this.activeUserInfo.first_name,
        last_name : this.activeUserInfo.last_name,
        email : this.activeUserInfo.email,
      }

      this.$store.dispatch("roleManagement/updateProfile", userData)
        .then(res => { 
            this.$vs.loading.close('#editProfileLoadingDiv > .con-vs-loading')

            this.$vs.notify({
                title: "Success.",
                text: "Profile updated successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          Object.keys(err.data).forEach(function(key) {
            self.errors.add({
              field: key,
              msg: err.data[key][0],
            });
          });

          this.$vs.loading.close('#editProfileLoadingDiv > .con-vs-loading')
        })

    },
    resetProfileData() {
      this.activeUserInfo = JSON.parse(localStorage.getItem("userInfo"))
    }
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
<style lang="css">
#settingAddressContainer{
  position: relative;
  width: 100%;
  max-width: none;
}
</style>