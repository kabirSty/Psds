<template>
  <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.displayName">

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ getCompanyName() }} {{ activeUserInfo.first_name}} {{ activeUserInfo.last_name}}</p>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

      <div class="con-img ml-3">
        <img key="onlineImg" src="https://img.icons8.com/bubbles/2x/user.png" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">
          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout">
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Logout</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
  
export default {
  data() {
    return {

    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    }
  },
  methods: {
    getCompanyName() {
      if(this.checkRoles(['manager', 'staff'])){
        let user = JSON.parse(localStorage.getItem("userInfo"))
        if(user && user.companies && user.companies.length){
            return user.companies[0].name+"  |  "
        }
      }

      return "";
    },
    checkRoles(roles) {
        let user = JSON.parse(localStorage.getItem("userInfo"))
        if(user && user.roles_array){
            for (let i = 0; i < roles.length; i++){
                if(user.roles_array.includes(roles[i])) return true
            }
        }

        return false;
    },
    logout() {
        // If JWT login
        if(localStorage.getItem("accessToken")) {
          localStorage.removeItem("accessToken")
          window.location.href = '/login';
          // this.$router.push('/login').catch(() => {})
        }

        localStorage.removeItem('clubData')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('tokenExpiry')

        // This is just for demo Purpose. If user clicks on logout -> redirect
        window.location.href = '/login';
        // this.$router.push('/login').catch(() => {})
    },
  }
}
</script>
