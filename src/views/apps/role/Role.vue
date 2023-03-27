<template>
    <vx-card title="Default">
        <vs-alert color="primary" icon="new_releases" active="true">
            <p>You can assign & detach permissions to a role</p>
        </vs-alert><br><br>

        <vs-popup  fullscreen classContent="popup-example h-full" title="Manage Permissions" :active.sync="activePromptPermission">
          <div id="changePermissionsLoadingDiv" class="vs-con-loading__container">
            <form data-vv-scope="changePermissionsForm">
                <table class="w-full">
                  <tr v-for="(groupPermission, index) in role.permissions" :key="index">
                    <td class="px-3 py-2">{{ getPermissionName(groupPermission)}}</td>
                    <td class="px-3 py-2">
                        <vs-row>
                            <vs-checkbox  v-for="(val, name) in groupPermission" :key="name" :vs-value="true" v-model="val.hasPermission" class="mr-2">{{ val.display_name}}</vs-checkbox>
                            <vs-divider></vs-divider>
                        </vs-row>
                    </td>
                  </tr>
                </table>

                <div align="right" class="vx-row">
                    <div  class="vx-col w-full mb-2">
                      <vs-button  v-on:click.prevent="savePermissions()" color="primary" type="filled">Save Permissions</vs-button>
                    </div>
                </div>
            </form>
          </div>
        </vs-popup>

        <vs-popup  classContent="popup-example h-full" title="Edit Role" :active.sync="activePromptEditRole">
          <div id="editRoleLoadingDiv" class="vs-con-loading__container">
            <form data-vv-scope="editRoleForm">
                <div class="vx-row mb-base">
                    <div class="vx-col w-full">
                        <vs-input v-validate="'required|alpha'" placeholder="Your Name" name="display_name" v-model="role.display_name" class="mt-5 w-full" />
                        <span class="text-danger text-sm"  v-show="errors.has('display_name')">{{ errors.first('display_name') }}</span>
                    </div>

                    <div class="vx-col w-full">
                        <vs-input v-validate="'required|alpha_dash'" placeholder="Your Username" name="description" v-model="role.description" class="mt-5 w-full" />
                        <span class="text-danger text-sm" v-show="errors.has('description')">{{ errors.first('description') }}</span>
                    </div>
                </div>
                <div align="right" class="vx-row">
                    <div  class="vx-col w-full mb-2">
                        <vs-button  v-on:click.prevent="updateRole()" color="primary" type="filled">Save Role</vs-button>
                    </div>
                </div>
            </form>
          </div>
        </vs-popup>

        <vs-table :data="roles">

            <template slot="thead">
                <vs-th>Display name</vs-th>
                <vs-th>Name</vs-th>
                <vs-th>Description</vs-th>
                <vs-th>Action</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].display_name">
                        {{data[indextr].display_name}}
                    </vs-td>
                    <vs-td :data="data[indextr].name">
                        {{data[indextr].name}}
                    </vs-td>
                    <vs-td :data="data[indextr].description">
                        {{data[indextr].description}}
                    </vs-td>
                    <vs-td>
                        <vs-row>
                            <vs-button class="mr-2" color="primary" type="border" icon-pack="feather" icon="icon-edit" @click="clickEditRole(data[indextr])"></vs-button>
                            <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="clickEditPermission(data[indextr])"></vs-button>
                        </vs-row>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
</template>

<script>
import moduleRoleManagement from '@/store/role-management/moduleRoleManagement.js'

export default {
    data() {
        return {
            users: [],
            activePromptPermission: false,
            activePromptEditRole: false,
            permissions: [],
            roles: [],
            role: {
                permissions : []
            },
        }
    },
    computed: {
        // roles() {
        //     let roles = this.$store.state.roleManagement.roles
        //     return roles;

        // }
    },
    mounted() {
        this.roles = this.$store.state.roleManagement.roles
    },
    methods: {
        getPermissionName(permission){
            let description = permission[0].description
            return description[0].toUpperCase() + description.slice(1);
        },
        savePermissions(){
            var self = this
            let permissionIds = []
            this.$vs.loading({
                container: '#changePermissionsLoadingDiv',
                scale: 0.6
            })

            for (let i = 0; i < this.role.permissions.length; i++) {
                for (let j = 0; j < this.role.permissions[i].length; j++) {
                    if(this.role.permissions[i][j].hasPermission){
                        permissionIds.push(this.role.permissions[i][j].id)
                    }
                }
            }

            let data = { role_id : this.role.id, permission_id : permissionIds }

            this.$store.dispatch("roleManagement/assignDetachPermission", data)
                .then(res => { 
                    this.$vs.loading.close('#changePermissionsLoadingDiv > .con-vs-loading')
                    this.activePromptPermission = false
                    this.$vs.notify({
                        title: "Success.",
                        text: "Permissions changed successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });
                })
                .catch(err => { 
                  this.$vs.loading.close('#changePermissionsLoadingDiv > .con-vs-loading')
                })
        },
        updateRole(){
            var self = this
            this.$vs.loading({
                container: '#editRoleLoadingDiv',
                scale: 0.6
            })

            let data = { 
                id : this.role.id,
                name : this.role.name, 
                description : this.role.description, 
                display_name : this.role.display_name, 
            }

            this.$store.dispatch("roleManagement/updateRole", data)
                .then(res => { 
                    this.$vs.loading.close('#editRoleLoadingDiv > .con-vs-loading')
                    this.activePromptEditRole = false

                    this.$vs.notify({
                        title: "Success.",
                        text: "Role changed successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });
                })
                .catch(err => { 
                  this.$vs.loading.close('#editRoleLoadingDiv > .con-vs-loading')
                })
        },
        clickEditPermission(role){
            this.role = role
            this.activePromptPermission = true
        },
        clickEditRole(role){
            this.role = role
            this.activePromptEditRole = true
        }
    },
    async created() {
        // Register Module UserManagement Module
        if(!moduleRoleManagement.isRegistered) {
          this.$store.registerModule('roleManagement', moduleRoleManagement)
          moduleRoleManagement.isRegistered = true
        }

        await this.$store.dispatch("roleManagement/viewRole")
        this.roles = this.$store.state.roleManagement.roles
    },

}
</script>