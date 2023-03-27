<template>
  <div id="user-edit-tab-info">
    <div id="editUserLoadingDiv" class="vs-con-loading__container">
      <form data-vv-scope="editUserForm">
        <div class="vx-row mb-base">
          <div class="vx-col w-full">
            <div class="flex items-start flex-col sm:flex-row">
              <img :src="data_local.image" class="mr-8 rounded h-24 w-24" />
              <div>
                <p class="text-lg font-medium mb-2 mt-8 sm:mt-8">{{ data.first_name  }} {{ data.last_name  }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <vs-input class="w-full" v-validate="'required|alpha'" label-placeholder="First name" ref="first_name" name="first_name" v-model="data_local.first_name"/>
            <span class="text-danger text-sm"  v-show="errors.has('editUserForm.first_name')">{{ errors.first('editUserForm.first_name') }}</span>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <vs-input class="w-full" v-validate="'required|alpha_dash'" label-placeholder="Last name" name="last_name" v-model="data_local.last_name"/>
            <span class="text-danger text-sm" v-show="errors.has('editUserForm.last_name')">{{ errors.first('editUserForm.last_name') }}</span>
          </div>
        </div>

        <div class="vx-row mt-4">
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <vs-input class="w-full" v-validate="'required|email'" label-placeholder="Email" name="email" v-model="data_local.email"/>
            <span class="text-danger text-sm"  v-show="errors.has('editUserForm.email')">{{ errors.first('editUserForm.email') }}</span>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <label>Gender</label>
            <ul class="demo-alignment">
              <li class="mt-0">
                <input type="radio" id="homeLabel" class="form-check-input" value="male" v-model="data_local.gender" :checked="data_local.gender == 'male'">
                <label for="homeLabel"> Male </label>
              </li>
              <li class="mt-0">
                <input type="radio" id="WorkPlaceLabel" class="form-check-input" value="female" v-model="data_local.gender" :checked="data_local.gender == 'female'">
                <label for="WorkPlaceLabel"> Female </label>
              </li>
              <li class="mt-0"> 
                <input type="radio" id="OtherLabel" class="form-check-input" value="non_binary" v-model="data_local.gender" :checked="data_local.gender != 'non_binary'">
                <label for="OtherLabel"> Non binary </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="vx-row mt-4 mb-base">
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <label>Date of birth</label>
            <datepicker format="yyyy-MM-dd" v-model="data_local.dob"></datepicker>
            <span class="text-danger text-sm"  v-show="errors.has('editUserForm.dob')">{{ errors.first('editUserForm.dob') }}</span>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <label>Password</label>
            <vs-input class="w-full" v-validate="'min:6|max:10'"  name="password" v-model="data_local.password"/>
            <span class="text-danger text-sm"  v-show="errors.has('editUserForm.password')">{{ errors.first('editUserForm.password') }}</span>
          </div>
        </div>

        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full">
            <label>Status</label>
            <vs-switch @input="updateUserStatus" style="width: 70px;" color="success" v-model="status">
                <span slot="on">Active</span>
                <span slot="off"> In active</span>
            </vs-switch>
          </div>
          <div class="vx-col md:w-1/2 w-full">
            <label>Email</label>
            <vs-switch v-model="email_verify" color="success">
                <span slot="on">Verified</span>
                <span slot="off">Not Verified</span>
            </vs-switch>
          </div>
        </div>

        <div align="right" class="vx-row mt-24">
          <div  class="vx-col w-full mt-24">
            <div class="mt-8 flex flex-wrap items-center justify-end">
              <vs-button  @click="openDeleteStudentConfirm()" class="mr-2" color="danger" type="filled" icon-pack="feather" icon="icon-trash">Delete User</vs-button>
              <vs-button  @click="validateEditUserForm()" color="primary" type="filled" icon-pack="feather" icon="icon-save">Save User</vs-button>
            </div>
            
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import Datepicker from 'vuejs-datepicker';
import moduleRoleManagement from '@/store/role-management/moduleRoleManagement.js'

export default {
  components: {
    vSelect,
    Datepicker,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      data_local : {
        password : ""
      },
      data_local: JSON.parse(JSON.stringify(this.data)),
      verify: (this.data.verify == "1") ? true : false,
      email_verify: (this.data.email_verified_at) ? true : false,
      isProfileImageChanged : false,
      roles : [],
      status: (this.data.status == "active") ? true : false,
    }
  },
  computed: {
    getValidationCP() {
      if(this.data_local.password && this.data_local.password != ""){
        return 'required|min:6|max:12|confirmed:password'
      }
      else return 'min:6|max:12|confirmed:password' 
    },
    validateForm() {
      return !this.errors.any()
    }
  },
  methods: {
    checkRoles(roles) {
        let user = JSON.parse(localStorage.getItem("userInfo"))
        if(user && user.roles_array){
            for (let i = 0; i < roles.length; i++){
                if(user.roles_array.includes(roles[i])) return true
            }
        }

        return false;
    },
    openDeleteStudentConfirm() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: 'Are you sure to comfirm to delete this user ?',
        accept: this.acceptAlert
      })
    },
    acceptAlert() {
      this.$vs.loading({ color: '#ff8000' })

      this.$store.dispatch("roleManagement/deleteUser", this.data_local.id)
        .then(res => { 
          this.$vs.loading.close()

          this.$router.push("/users").catch(() => {})

          this.$vs.notify({
            title: "Success.",
            text: "User deleted successfully.",
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger"
          });
        })
        .catch(err => { 
          this.$vs.loading.close()
        })
    },
    reset_data() {
      this.data_local = JSON.parse(JSON.stringify(this.data))
    },
    validateEditUserForm() {
      this.$validator.validateAll('editUserForm').then(result => {
        if (result) this.updateUser()
      })
    },
    updateUserStatus() {
      var self = this
      this.$vs.loading({
        container: '#editUserLoadingDiv',
        scale: 0.6
      })

      let data = { 
        user_id : this.data_local.id,
        status : (this.status) ? 'active' : 'blocked',
      }

      this.$store.dispatch("roleManagement/updateUserStatus", data)
        .then(res => { 
          this.$vs.loading.close('#editUserLoadingDiv > .con-vs-loading')

          this.$vs.notify({
            title: "Success.",
            text: "User updated successfully.",
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success"
          });
        })
        .catch(err => { 
          this.$vs.loading.close('#editUserLoadingDiv > .con-vs-loading')
        })
    },
    updateUser() {
      var self = this
      this.$vs.loading({
          container: '#editUserLoadingDiv',
          scale: 0.6
      })

      var dobDate = new Date(this.data_local.dob);
      var dobDateString = dobDate.toISOString().substring(0, 10);

      let data = { 
        id : this.data_local.id,
        first_name : this.data_local.first_name,
        last_name : this.data_local.last_name,
        gender : this.data_local.gender,
        dob : dobDateString,
        email : this.data_local.email,
        phone : this.data_local.phone,
        password : this.data_local.password,
        email_verify : this.email_verify,
      }

      this.$store.dispatch("roleManagement/updateUser", data)
        .then(res => { 
            this.$vs.loading.close('#editUserLoadingDiv > .con-vs-loading')
            this.activePromptAddUser = false
            this.$vs.notify({
                title: "Success.",
                text: "User updated successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          if(err.status && err.status == 422){
            Object.keys(err.data.errors).forEach(function(key) {
              self.errors.add({
                field: key,
                scope: "editUserForm",
                msg: err.data.errors[key][0],
              });
            });
          }
                
          this.$vs.loading.close('#editUserLoadingDiv > .con-vs-loading')
        })
    },
  },
  mounted() {
    
  
  },
  async created() {
    if(!moduleRoleManagement.isRegistered) {
      this.$store.registerModule('roleManagement', moduleRoleManagement)
      moduleRoleManagement.isRegistered = true
    }

    // await this.$store.dispatch("roleManagement/viewRole")
    // this.roles = this.$store.state.roleManagement.roles
  }
}
</script>
