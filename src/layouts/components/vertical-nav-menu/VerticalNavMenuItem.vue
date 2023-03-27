<template>
  <div
    v-if="canSee"
    class="vs-sidebar--item"
    :class="[
      {'vs-sidebar-item-active'            : activeLink},
      {'disabled-item pointer-events-none' : isDisabled}
    ]" >

      <router-link
        tabindex="-1"
        v-if="to"
        exact
        :class="[{'router-link-active': activeLink}]"
        :to="to"
        :target="target" >
          <vs-icon v-if="!featherIcon" :icon-pack="iconPack" :icon="icon" />
          <feather-icon v-else :class="{'w-3 h-3': iconSmall}" :icon="icon" />
          <slot />
      </router-link>

      <a v-else :target="target" :href="href" tabindex="-1">
        <vs-icon v-if="!featherIcon" :icon-pack="iconPack" :icon="icon" />
        <feather-icon v-else :class="{'w-3 h-3': iconSmall}" :icon="icon" />
        <slot />
      </a>
  </div>
</template>

<script>
export default {
  name: 'v-nav-menu-item',
  props: {
    icon        : { type: String,                 default: ""               },
    iconSmall   : { type: Boolean,                default: false            },
    iconPack    : { type: String,                 default: 'material-icons' },
    href        : { type: [String, null],         default: '#'              },
    to          : { type: [String, Object, null], default: null             },
    slug        : { type: String,                 default: null             },
    index       : { type: [String, Number],       default: null             },
    featherIcon : { type: Boolean,                default: true             },
    target      : { type: String,                 default: '_self'          },
    isDisabled  : { type: Boolean,                default: false            },
  },
  computed: {
    canSee() {
      if(this.to){
        if(this.$router.match(this.to).meta.permissions){
          let response = false
          let returnResponse = false
          let permissions = this.$router.match(this.to).meta.permissions
          let roles = this.$router.match(this.to).meta.roles
          let user = JSON.parse(localStorage.getItem("userInfo"))

          if(user){
            for (var index = 0; index < roles.length; ++index) {
              if(user.roles_array.includes(roles[index]) || roles[index] == '*'){
                returnResponse = true;
              }
            }

            for (var index = 0; index < permissions.length; ++index) {
              if(user.permissions_array.includes(permissions[index]) || permissions[index] == '*'){
                returnResponse = true;
              }
            }
          }
          return returnResponse
        }
        else 

          return true;
      }
      else return true;
    },
    activeLink() {
      return ((this.to == this.$route.path) || (this.$route.meta.parent == this.slug) && this.to) ? true : false
    }
  }
}

</script>

