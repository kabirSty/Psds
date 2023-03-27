<template>
  <div id="page-user-list">
    <div class="vx-card p-6">
      <div id="viewUsersLoadingDiv" class="vs-con-loading__container">
      <vs-table
          :sst="true"
          @search="handleSearch"
          @change-page="handleChangePage"
          @sort="handleSort"
          v-model="selected"
          search
          :data="usersData">

          <template slot="header">
             <div class="flex flex-wrap items-center w-full">
                <vs-button class="mb-4 md:mb-0 mr-2" type="filled" icon-pack="feather" icon="icon-download" @click="gridApi.exportDataAsCsv()"></vs-button>
                <!-- <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addUser()">Add User</vs-button> -->
            </div>
          </template>

          <template slot="thead">
              <vs-th sort-key="first_name">Full Name</vs-th>
              <vs-th sort-key="email">Email</vs-th>
              <vs-th sort-key="dob">DOB</vs-th>
              <vs-th >Gender</vs-th>
              <vs-th >Status</vs-th>
              <vs-th >Email</vs-th>
              <vs-th>Action</vs-th>
          </template>

          <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                   <vs-td :data="data[indextr].name">
                      <cell-renderer-link :data="data[indextr]"/>
                  </vs-td>
                  <vs-td :data="data[indextr].email" >
                      <span class="ml13 sm:text-1em mb-4" v-html="data[indextr].email"></span>
                  </vs-td>
                  <vs-td :data="data[indextr].dob">
                      <span class="ml13 sm:text-1em mb-4" v-html="data[indextr].dob"></span>
                  </vs-td>
                  <vs-td :data="data[indextr].gender">
                      <cell-renderer-gender :data="data[indextr]"/>
                  </vs-td>
                  <vs-td :data="data[indextr].gender">
                      <cell-renderer-status :data="data[indextr]"/>
                  </vs-td>
                  <vs-td :data="data[indextr].name">
                      <cell-renderer-verified :data="data[indextr]"/>
                  </vs-td>
                  <vs-td :data="data[indextr].name" >
                      <cell-renderer-actions :data="data[indextr]"/>
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>

      <div class="vx-row mt-base">
          <div class="vx-col w-full mb-2">
              <vs-pagination :total="totalPage" v-model="currentPage"></vs-pagination>
          </div>
      </div>

      <vs-popup  classContent="popup-example h-full" title="Add user" :active.sync="activePromptAddUser">
        <div id="addUserLoadingDiv" class="vs-con-loading__container">
          <form data-vv-scope="addUserForm">
            <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|alpha'" label-placeholder="First name" ref="first_name" name="first_name" v-model="user.first_name"/>
                <span class="text-danger text-sm"  v-show="errors.has('addUserForm.first_name')">{{ errors.first('addUserForm.first_name') }}</span>
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|alpha_dash'" label-placeholder="Last name" name="last_name" v-model="user.last_name"/>
                <span class="text-danger text-sm" v-show="errors.has('addUserForm.last_name')">{{ errors.first('addUserForm.last_name') }}</span>
              </div>
            </div>

            <div class="vx-row mt-4">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|email'" label-placeholder="Email" name="email" v-model="user.email"/>
                <span class="text-danger text-sm"  v-show="errors.has('addUserForm.email')">{{ errors.first('addUserForm.email') }}</span>
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|numeric|min:9'" label-placeholder="Phone number" name="phone" v-model="user.phone"/>
                <span class="text-danger text-sm" v-show="errors.has('addUserForm.phone')">{{ errors.first('addUserForm.phone') }}</span>
              </div>
            </div>

            <div class="vx-row mt-4">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|min:6|max:50'" label-placeholder="Password" name="password" v-model="user.password"/>
                <span class="text-danger text-sm"  v-show="errors.has('addUserForm.password')">{{ errors.first('addUserForm.password') }}</span>
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-2" v-if="checkRoles(['superadmin', 'admin'])">
                Company
                <v-select name="name" label="name" :options="companies" v-model="selected_companies">
                  <template slot="option" slot-scope="option">
                     <span :class="option.icon"></span>
                     {{ option.name }}
                 </template>
                 <template slot="selected-option" slot-scope="option">
                     <span :class="option.icon"></span>
                     {{ option.name }}
                 </template>
                </v-select>
              </div>
            </div>

            <div class="vx-row mt-4" v-if="checkRoles(['superadmin', 'admin'])">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                Select roles
                <ul class="demo-alignment">
                  <li v-for="(role, index) in roles" :key="index">
                      <vs-checkbox  v-model="user.roles" :vs-value="role.id">{{ role.display_name }}</vs-checkbox>
                  </li>
                </ul>
                <span class="text-danger text-sm" v-show="errors.has('addUserForm.roles')">{{ errors.first('addUserForm.roles') }}</span>
              </div>
            </div>

            <div align="right" class="vx-row mt-4">
              <div  class="vx-col w-full mb-2">
                <vs-button  v-on:click.prevent="validateAddUserForm()" color="primary" type="filled">Add User</vs-button>
              </div>
            </div>
          </form>
        </div>
      </vs-popup>

      <vs-popup  classContent="popup-example h-full" title="Edit user" :active.sync="activePromptEditUser">
        <div id="editUserLoadingDiv" class="vs-con-loading__container">
          <form data-vv-scope="editUserForm">
            <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|alpha'" label-placeholder="First name" ref="first_name" name="first_name" v-model="user_edit.first_name"/>
                <span class="text-danger text-sm"  v-show="errors.has('editUserForm.first_name')">{{ errors.first('editUserForm.first_name') }}</span>
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|alpha_dash'" label-placeholder="Last name" name="last_name" v-model="user_edit.last_name"/>
                <span class="text-danger text-sm" v-show="errors.has('editUserForm.last_name')">{{ errors.first('editUserForm.last_name') }}</span>
              </div>
            </div>

            <div class="vx-row mt-4">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|email'" label-placeholder="Email" name="email" v-model="user_edit.email"/>
                <span class="text-danger text-sm"  v-show="errors.has('editUserForm.email')">{{ errors.first('editUserForm.email') }}</span>
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'required|min:9'" label-placeholder="Phone number" name="phone" v-model="user_edit.phone"/>
                <span class="text-danger text-sm" v-show="errors.has('editUserForm.phone')">{{ errors.first('editUserForm.phone') }}</span>
              </div>
            </div>

            <div class="vx-row mt-4">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" v-validate="'min:6|max:50'" label-placeholder="Password" name="password" v-model="user_edit.password"/>
                <span class="text-danger text-sm"  v-show="errors.has('editUserForm.password')">{{ errors.first('editUserForm.password') }}</span>
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-2">
                Select roles
                <ul class="demo-alignment">
                  <li v-for="(role, index) in roles" :key="index">
                      <vs-checkbox  v-model="user_edit.roles_array" :vs-value="role.id">{{ role.display_name }}</vs-checkbox>
                  </li>
                </ul>
                <span class="text-danger text-sm" v-show="errors.has('editUserForm.roles')">{{ errors.first('editUserForm.roles') }}</span>
              </div>
            </div>

            <div align="right" class="vx-row mt-4">
              <div  class="vx-col w-full mb-2">
                <vs-button  v-on:click.prevent="validateEditUserForm()" color="primary" type="filled">Add User</vs-button>
              </div>
            </div>
          </form>
        </div>
      </vs-popup>

    </div>
  </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import moduleRoleManagement from '@/store/role-management/moduleRoleManagement.js'
import CellRendererLink from "./cell-renderer/CellRendererLink.vue"
import CellRendererStatus from "./cell-renderer/CellRendererStatus.vue"
import CellRendererVerified from "./cell-renderer/CellRendererVerified.vue"
import CellRendererActions from "./cell-renderer/CellRendererActions.vue"
import CellRendererGender from "./cell-renderer/CellRendererGender.vue"

export default {
  components: {
    CellRendererLink,
    CellRendererStatus,
    CellRendererVerified,
    CellRendererActions,
    CellRendererGender,
  },
  data() {
    return {
      selected:[],
      key : null, 
      active : null,
      search : null,
      totalPage: 1,
      currentPage: 1,
      companies : [],
      selected_companies : [],
      currentPage_ : 1,
      usersData : [],
      roles : [],
      activePromptAddUser : false,
      activePromptEditUser : false,
      user : {
        first_name : null,
        last_name : null,
        email : null,
        phone : null,
        password : null,
        roles : [],
      },
      user_edit : {
        first_name : null,
        last_name : null,
        email : null,
        phone : null,
        password : null,
        roles : [],
        roles_array : [],
      },
      roleFilter: { label: 'All', value: 'all' },
      roleOptions: [
        { label: 'All', value: 'all' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Staff', value: 'staff' },
      ],

      statusFilter: { label: 'Status - All', value: 'all' },
      statusOptions: [
        { label: 'Status - All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Deactivated', value: 'deactivated' },
        { label: 'Blocked', value: 'blocked' },
      ],

      isVerifiedFilter: { label: 'Email - All', value: 'all' },
      isVerifiedOptions: [
        { label: 'Email - All', value: 'all' },
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
      ],
      searchQuery: "",
    }
  },
  watch: {
    currentPage(val) {
      this.searchUser()
    }
  },
  computed: {

  },
  methods: {
    checkPermission(permission) {
        let user = JSON.parse(localStorage.getItem("userInfo"))
        if(user && user.permissions_array){
          return user.permissions_array.includes(permission) ? true : false
        }

        return false;
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
    getRoleName(role) {
        return (role && role.name) ? role.name.charAt(0).toUpperCase() + role.name.slice(1) : ''
    },
    handleSearch(searching) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
            this.search = searching
            this.searchUser()
        }, 2000);   
    },
    handleChangePage(page) {
        // this.searchUser()
    },
    handleSort(key, active) {
        if(key){
            this.key = key
            this.active = active
            this.searchUser()
        }
    },
    setColumnFilter(column, val) {
      const filter = this.gridApi.getFilterInstance(column)
      let modelObj = null

      if(val !== "all") {
        modelObj = { type: "equals", filter: val }
      }

      filter.setModel(modelObj)
      this.gridApi.onFilterChanged()
    },
    resetColFilters() {
      this.gridApi.setFilterModel(null)
      this.gridApi.onFilterChanged()
      this.statusFilter = this.isVerifiedFilter = { label: 'All', value: 'all' }
      this.$refs.filterCard.removeRefreshAnimation()
    },
    updateSearchQuery(val) {
      this.gridApi.setQuickFilter(val)
    },
    addUser() {
      this.activePromptAddUser = true
    },
    validateAddUserForm() {
      this.$validator.validateAll('addUserForm').then(result => {
        if (result) this.createNerUser()
      })
    },
    createNerUser() {
      var self = this
      this.$vs.loading({
          container: '#addUserLoadingDiv',
          scale: 0.6
      })

      let data = { 
        first_name : this.user.first_name,
        last_name : this.user.last_name,
        email : this.user.email,
        phone : this.user.phone,
        password : this.user.password,
        // role_id : this.user.roles,
      }

      if(this.user.roles.length) data.role_id = this.user.roles;
      if(this.selected_companies) data.company_id = this.selected_companies.id;

      this.$store.dispatch("roleManagement/createUser", data)
        .then(res => { 
            this.$vs.loading.close('#addUserLoadingDiv > .con-vs-loading')
            this.activePromptAddUser = false
            this.usersData.push(res.data.data)
            this.$vs.notify({
                title: "Success.",
                text: "User created successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          this.$vs.loading.close('#addUserLoadingDiv > .con-vs-loading')
          Object.keys(err.data.errors).forEach(function(key) {
            self.errors.add({
              field: key,
              scope: "addUserForm",
              msg: err.data.errors[key][0],
            });
          });
        })
    },
    editRecord(user) {
      let roleIds = []
      for (let i = 0; i < user.roles.length; i++) roleIds.push(user.roles[i].id)
      this.user_edit = user
      this.user_edit.roles_array = roleIds
      this.activePromptEditUser = true
    },
    validateEditUserForm() {
      this.$validator.validateAll('editUserForm').then(result => {
        if (result) this.updateUser()
      })
    },
    updateUser() {
      var self = this
      this.$vs.loading({
          container: '#editUserLoadingDiv',
          scale: 0.6
      })

      let data = { 
        id : this.user_edit.id,
        first_name : this.user_edit.first_name,
        last_name : this.user_edit.last_name,
        email : this.user_edit.email,
        phone : this.user_edit.phone,
        password : this.user_edit.password,
        role_id : this.user_edit.roles_array,
      }

      this.$store.dispatch("roleManagement/updateUser", data)
        .then(res => { 
            this.$vs.loading.close('#editUserLoadingDiv > .con-vs-loading')
            this.activePromptAddUser = false
            this.$vs.notify({
                title: "Success.",
                text: "User created successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          this.$vs.loading.close('#editUserLoadingDiv > .con-vs-loading')
        })
    },
    async searchUser() {
      var self = this
      this.$vs.loading({
          container: '#viewUsersLoadingDiv',
          scale: 0.6
      })

      await this.$store.dispatch("roleManagement/viewUser", { search : this.search, sort : this.key, sortKey : this.active, page : this.currentPage})
        .then(res => { 
          this.totalPage = res.data.last_page
          this.$vs.loading.close('#viewUsersLoadingDiv > .con-vs-loading')
        })
        .catch(err => { 
          this.$vs.loading.close('#viewUsersLoadingDiv > .con-vs-loading')
        })

        this.usersData = this.$store.state.roleManagement.users
    },
    async viewUser() {
      var self = this

      await this.$store.dispatch("roleManagement/viewUser", {page : this.currentPage})
        .then(res => { 
          this.totalPage = res.data.last_page
        })

      this.usersData = this.$store.state.roleManagement.users
    },
  },
  mounted() {
    this.usersData = this.$store.state.roleManagement.users
    this.roles = this.$store.state.roleManagement.roles

    this.$root.$on('clickEditRecord', (user) => {
      this.editRecord(user)
    });
  },
  async created() {
    // Register Module UserManagement Module
    if(!moduleRoleManagement.isRegistered) {
      this.$store.registerModule('roleManagement', moduleRoleManagement)
      moduleRoleManagement.isRegistered = true
    }

    await this.viewUser()
    // await this.$store.dispatch("roleManagement/viewRole")
    
    // this.roles = this.$store.state.roleManagement.roles
  }
}

</script>

<style lang="scss">
#page-user-list {
  .user-list-filters {
    .vs__actions {
      position : absolute;
      right : 0;
      top : 50%;
      transform : translateY(-58%);
    }
  }
}

</style>

<style type="text/css">

.pagidropdown{
    padding: 11px!important;
}

.rounded-full {
    border-radius: 7px !important;
}

.studentSearchBtn{
  width: 34% ! important;
}

.studentSearchStatus{
  width: 17% ! important;
}

.studentSearchEmail{
  width: 17% ! important;
}
</style>