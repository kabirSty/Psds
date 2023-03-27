<template>
    <vx-card title="Recommended Apps">
        <div id="viewAppLoadingDiv" class="vs-con-loading__container">
            <vs-table :sst="true"
                @search="handleSearch"
                @change-page="handleChangePage"
                @sort="handleSort"
                v-model="selected"
                search
                :data="apps">

                <template slot="header">
                    <div class="flex flex-wrap items-center w-full">
                        <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addApp">Add App</vs-button>
                    </div>
                </template>

                <template slot="thead">
                    <vs-th sort-key="id">Id</vs-th>
                    <vs-th>Logo</vs-th>
                    <vs-th sort-key="name">Name</vs-th>
                    <vs-th style="width: 40%;" sort-key="description">Description</vs-th>
                    <vs-th>Android path</vs-th>
                    <vs-th>Ios path</vs-th>
                    <vs-th >Action</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].id">
                            {{data[indextr].id}}
                        </vs-td>
                        <vs-td :data="data[indextr].logo_path">
                            <img width="100" :src="data[indextr].logo_path">
                        </vs-td>
                        <vs-td :data="data[indextr].name">
                            {{data[indextr].name}}
                        </vs-td>
                        <vs-td style="width: 40%;" :data="data[indextr].description">
                            {{data[indextr].description}}
                        </vs-td>
                        <vs-td :data="data[indextr].android_path">
                            <feather-icon class="cursor-pointer" @click="redirectToAppPath(data[indextr].android_path)" icon="Share2Icon" svgClasses="w-10 h-10 text-primary"></feather-icon>
                        </vs-td>
                        <vs-td :data="data[indextr].ios_path">
                            <feather-icon class="cursor-pointer" @click="redirectToAppPath(data[indextr].ios_path)" icon="Share2Icon" svgClasses="w-10 h-10 text-primary"></feather-icon>
                        </vs-td>
                        <vs-td>
                            <vs-row>
                                <vs-button @click="editApp(data[indextr])" class="mr-2" color="primary" type="border" icon-pack="feather" icon="icon-edit"></vs-button>
                                <vs-button @click="deleteApp(data[indextr])" color="danger" type="filled" icon-pack="feather" icon="icon-trash"></vs-button>
                            </vs-row>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>

            <div class="vx-row mt-base">
                <div class="vx-col w-full mb-2">
                    <vs-pagination :total="totalPage" v-model="currentPage"></vs-pagination>
                </div>
            </div>

            <vs-popup  classContent="popup-example h-full" title="Add App" :active.sync="activePromptAddApp">
                <div id="createAppLoadingDiv" class="vs-con-loading__container">
                    <form data-vv-scope="addAppForm">
                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required'" placeholder="App name" name="name" v-model="add_app.name" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('addAppForm.name')">{{ errors.first('addAppForm.name') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required'" placeholder="App description" name="description" v-model="add_app.description" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('addAppForm.description')">{{ errors.first('addAppForm.description') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required|url'" placeholder="App android path" name="android_path" v-model="add_app.android_path" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('addAppForm.android_path')">{{ errors.first('addAppForm.android_path') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-base">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required|url'" placeholder="App ios path" name="ios_path" v-model="add_app.ios_path" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('addAppForm.ios_path')">{{ errors.first('addAppForm.ios_path') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-base">
                            <div class="vx-col sm:w-full mb-2">
                               <VueFileAgent
                                ref="vueFileAgendsdt"
                                :theme="'list'"
                                :multiple="false"
                                :deletable="true"
                                :meta="true"
                                :compact="true"
                                :accept="'image/*'"
                                :maxSize="'5MB'"
                                :helpText="'Choose app logo'"
                                :errorText="{
                                  type: 'Invalid file type. Only image Allowed',
                                  size: 'Files should not exceed 5MB in size',
                                }"
                                @select="filesSelected($event)"
                                @beforedelete="onBeforeDelete($event)"
                                @delete="fileDeleted($event)"
                                v-model="image"
                              ></VueFileAgent>
                            </div>
                        </div>

                        <div align="right" class="vx-row">
                            <div  class="vx-col w-full mb-2">
                                <vs-button  v-on:click.prevent="createApp()" color="primary" type="filled">Save App</vs-button>
                            </div>
                        </div>
                    </form>
                </div>
            </vs-popup>

            <vs-popup  classContent="popup-example h-full" title="Edit App" :active.sync="activePromptEditApp">
                <div id="editAppLoadingDiv" class="vs-con-loading__container">
                    <form data-vv-scope="editAppForm">
                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required'" placeholder="App name" name="name" v-model="edit_app.name" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('editAppForm.name')">{{ errors.first('editAppForm.name') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required'" placeholder="App description" name="description" v-model="edit_app.description" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('editAppForm.description')">{{ errors.first('editAppForm.description') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required|url'" placeholder="App android path" name="android_path" v-model="edit_app.android_path" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('editAppForm.android_path')">{{ errors.first('editAppForm.android_path') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-base">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required|url'" placeholder="App ios path" name="ios_path" v-model="edit_app.ios_path" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('editAppForm.ios_path')">{{ errors.first('editAppForm.ios_path') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-base">
                            <div class="vx-col sm:w-full mb-2">
                               <VueFileAgent
                                ref="vueFileAgendsdt"
                                :theme="'list'"
                                :multiple="false"
                                :deletable="true"
                                :meta="true"
                                :compact="true"
                                :accept="'image/*'"
                                :maxSize="'5MB'"
                                :helpText="'Choose app logo'"
                                :errorText="{
                                  type: 'Invalid file type. Only image Allowed',
                                  size: 'Files should not exceed 5MB in size',
                                }"
                                @select="filesSelected($event)"
                                @beforedelete="onBeforeDelete($event)"
                                @delete="fileDeleted($event)"
                                v-model="image"
                              ></VueFileAgent>
                            </div>
                        </div>

                        <div align="right" class="vx-row mt-8 mt-base">
                            <div  class="vx-col w-full mb-2">
                                <vs-button  v-on:click.prevent="updateApp()" color="primary" type="filled">Update App</vs-button>
                            </div>
                        </div>
                    </form>
                </div>
            </vs-popup>
        </div>
    </vx-card>
</template>

<script>
import vSelect from 'vue-select'
import modulePlaceManagement from '@/store/place-management/modulePlaceManagement.js'

export default {
    components: {
        vSelect
    },
    data() {
        return {
            selected:[],
            key : null, 
            active : null,
            search : null,
            totalPage: 1,
            currentPage: 1,
            apps: [],
            add_app: {
                name : null,
                description : null,
                android_path : null,
                ios_path : null,
            },
            edit_app: {
                name : null,
                description : null,
                android_path : null,
                ios_path : null,
            },
            image : [],
            fileRecordsForUpload: [],
            activePromptAddApp : false,
            activePromptEditApp : false,
            deleteAppData : null,
            editAppData : null,
        }
    },
    watch: {
        currentPage(val) {
            this.searchApps()
        }
    },
    mounted() {
        this.apps = this.$store.state.placeManagement.apps
    },
    methods: {
        redirectToAppPath(path){
            window.open(path, "_blank");
        },
        filesSelected: function (fileRecordsNewlySelected) {
            var validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
            this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
        },
        onBeforeDelete: function (fileRecord) {
            // this.$refs.vueFileAgent.deleteFileRecord(fileRecord);
            var i = this.fileRecordsForUpload.indexOf(fileRecord);
            if (i !== -1) {
            // queued file, not yet uploaded. Just remove from the arrays
              this.fileRecordsForUpload.splice(i, 1);
              var k = this.image.indexOf(fileRecord);
              if (k !== -1) this.image.splice(k, 1);
            } else {
              this.$refs.vueFileAgent.deleteFileRecord(fileRecord);
            }
        },
        fileDeleted: function (fileRecord) {
            this.$refs.vueFileAgent.deleteUpload(fileRecord);
            // var i = this.fileRecordsForUpload.indexOf(fileRecord);
            // if (i !== -1) {
            //     this.fileRecordsForUpload.splice(i, 1);
            // } else {
            //     this.deleteUploadedFile(fileRecord);
            // }
        },
        deleteUploadedFile: function (fileRecord) {
            this.$refs.vueFileAgent.deleteUpload(this.uploadUrl, this.uploadHeaders, fileRecord);
        },
        deleteApp(app) {
            this.deleteAppData = app;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Are you sure to delete this app data ?',
                accept: this.acceptDeleteApp
            })
        },
        acceptDeleteApp() {
            this.$vs.loading();

            this.$store.dispatch("placeManagement/deleteApp", { id : this.deleteAppData.id})
                .then(res => { 
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: "Success.",
                        text: "App deleted successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });
                })
                .catch(err => { 
                  this.$vs.loading.close()
                })
        },
        editApp(app) {
            this.image = [];
            this.edit_app = app;
            this.deleteAppData = app;
            this.activePromptEditApp = true
        },
        addApp() {
            this.image = [];
            this.activePromptAddApp = true
        },
        createApp() {
            this.$validator.validateAll('addAppForm').then(result => {
                if (result) this.createAppApi()
            })
        },
        createAppApi() {
            var self = this 
            this.$vs.loading({
              container: '#createAppLoadingDiv',
              scale: 0.6
            })

            let data = new FormData();
            data.append('name', this.add_app.name);
            data.append('description', this.add_app.description);
            data.append('ios_path', this.add_app.ios_path);
            data.append('android_path', this.add_app.android_path);
            if(this.image.length) data.append('logo', this.image[0].file);

            this.$store.dispatch("placeManagement/createApp", data)
                .then(res => { 
                    this.$vs.loading.close('#createAppLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: "Success.",
                        text: "App created successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });

                    this.image = [];
                    this.add_app = {
                        name : null,
                        description : null,
                        android_path : null,
                        ios_path : null,
                    };

                    this.activePromptAddApp = false;
                })
                .catch(err => { 
                    this.$vs.loading.close('#createAppLoadingDiv > .con-vs-loading')

                    Object.keys(err.data.errors).forEach(function(key) {
                        self.errors.add({
                            field: key,
                            scope: "addAppForm",
                            msg: err.data.errors[key][0],
                        });
                    });
                })
        },
        updateApp() {
            this.$validator.validateAll('editAppForm').then(result => {
                if (result) this.updateAppApi()
            })
        },
        updateAppApi() {
            var self = this 

            this.$vs.loading({
              container: '#editAppLoadingDiv',
              scale: 0.6
            })

            let data = new FormData();
            data.append('id', this.edit_app.id);
            data.append('name', this.edit_app.name);
            data.append('description', this.edit_app.description);
            data.append('ios_path', this.edit_app.ios_path);

            data.append('android_path', this.edit_app.android_path);
            if(this.image.length) data.append('logo', this.image[0].file);

            this.$store.dispatch("placeManagement/updateApp", data)
                .then(res => { 
                    this.$vs.loading.close('#editAppLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: "Success.",
                        text: "App updated successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });

                    this.edit_app = {
                        name : null,
                        price : null,
                    };

                    this.activePromptEditApp = false;
                })
                .catch(err => { 
                    this.$vs.loading.close('#editAppLoadingDiv > .con-vs-loading')

                    Object.keys(err.data.errors).forEach(function(key) {
                        self.errors.add({
                            field: key,
                            scope: "editAppForm",
                            msg: err.data.errors[key][0],
                        });
                    });
                })
        },
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

            this.$store.dispatch("placeManagement/assignDetachPermission", data)
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
        clickEditPermission(role){
            this.role = role
            this.activePromptPermission = true
        },
        clickEditRole(role){
            this.role = role
            this.activePromptEditRole = true
        },
        handleSearch(searching) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(() => {
                this.search = searching
                this.searchApps()
            }, 2000);   
        },
        handleChangePage(page) {
            // this.searchUser()
        },
        handleSort(key, active) {
            if(key){
                this.key = key
                this.active = active
                this.searchApps()
            }
        },
        async searchApps() {
            var self = this
            this.$vs.loading({
                container: '#viewAppLoadingDiv',
                scale: 0.6
            })

            await this.$store.dispatch("placeManagement/viewApp", { search : this.search, sort : this.key, sort_key : this.active, page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                    this.$vs.loading.close('#viewAppLoadingDiv > .con-vs-loading')
                })
                .catch(err => { 
                    this.$vs.loading.close('#viewAppLoadingDiv > .con-vs-loading')
                })

                this.apps = this.$store.state.placeManagement.apps
        },
        async viewApps() {
            var self = this

            await this.$store.dispatch("placeManagement/viewApp", {page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                })

            this.apps = this.$store.state.placeManagement.apps
        },
    },
    async created() {
        if(!modulePlaceManagement.isRegistered) {
            this.$store.registerModule('placeManagement', modulePlaceManagement)
            modulePlaceManagement.isRegistered = true
        }

        await this.viewApps() 
    },
}
</script>
