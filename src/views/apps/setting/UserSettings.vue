<template>
  <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none" id="profile-tabs" :key="isSmallerScreen">

    <!-- GENERAL -->
    <vs-tab icon-pack="feather" icon="icon-user" :label="!isSmallerScreen ? 'Profile' : ''">
      <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-profile />
      </div>
    </vs-tab>
    <vs-tab icon-pack="feather" icon="icon-lock" :label="!isSmallerScreen ? 'Change Password' : ''">
      <div class="tab-change-pwd md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-change-password />
      </div>
    </vs-tab>
  </vs-tabs>
</template>

<script>
import UserSettingsProfile from "./UserSettingsProfile.vue"
import UserSettingsChangePassword from "./UserSettingsChangePassword.vue"

// import moduleClubManagement from '@/store/club-management/moduleClubManagement.js'

export default {
  components: {
    UserSettingsProfile,
    UserSettingsChangePassword,
  },
  data() {
    return {

    }
  },
  methods: {
    getClubData() {
      // this.$store.dispatch("clubManagement/getClubData")
      //   .then(res => { })
      //   .catch(err => { })
    },
  },
  computed: {
    isSmallerScreen() {
      return this.$store.state.windowWidth < 768
    }
  },
  created() {
    // if(!moduleClubManagement.isRegistered) {
    //     this.$store.registerModule('clubManagement', moduleClubManagement)
    //     moduleClubManagement.isRegistered = true
    // }

    this.getClubData()
  },
}
</script>

<style lang="scss">
#profile-tabs {
  .vs-tabs--content {
    padding: 0;
  }
}
</style>
