<template>
  <div id="page-user-edit">

    <vs-alert color="danger" title="User Not Found" :active.sync="user_not_found">
      <span>User record with id: {{ $route.params.userId }} not found or not a valid User. </span>
      <span>
        <span>Check </span><router-link :to="{name:'Users'}" class="text-inherit underline">All User</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="user_data">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Account" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <user-edit-tab-account class="mt-4" :data="user_data" />
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import UserEditTabAccount from "./UserEditTabAccount.vue"
import moduleRoleManagement from '@/store/role-management/moduleRoleManagement.js'

export default {
  components: {
    UserEditTabAccount,
  },
  data() {
    return {
      user_data: null,
      user_not_found: false,
      activeTab: 0,
    }
  },
  watch: {
    activeTab() {
      this.fetch_user_data(this.$route.params.userId)
    }
  },
  methods: {
    hasRoles(roles) {
        let user = this.user_data
        if(user && user.roles_array_name){
            for (let i = 0; i < roles.length; i++){
                if(user.roles_array_name.includes(roles[i])) return true
            }
        }

        return false;
    },
    fetch_user_data(userId) {
      this.$store.dispatch("roleManagement/viewAUser", {id : userId})
        .then(res => { 
          if(res.data && res.data.total){
            let roleIds = []
            let roleNames = []
            let user = res.data.data[0];
            this.user_data = user
          }
          else this.user_not_found = true
        })
        .catch(err => {
          this.user_not_found = true
          return 
        })
    },
  },
  created() {
    // Register Module UserManagement Module
    if(!moduleRoleManagement.isRegistered) {
      this.$store.registerModule('roleManagement', moduleRoleManagement)
      moduleRoleManagement.isRegistered = true
    }
    this.fetch_user_data(this.$route.params.userId)
  }
}

</script>
