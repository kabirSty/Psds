<template>
    <vx-card title="Languages">
        <div id="viewLanguageLoadingDiv" class="vs-con-loading__container">
            <vs-table :sst="true"
                @search="handleSearch"
                @change-page="handleChangePage"
                @sort="handleSort"
                v-model="selected"
                search
                :data="languages">

                <template slot="header">
                    <div class="flex flex-wrap items-center w-full">
                        <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addLanguage">Add Language</vs-button>
                    </div>
                </template>

                <template slot="thead">
                    <vs-th sort-key="id">Id</vs-th>
                    <vs-th sort-key="name" style="width: 40%;">Name</vs-th>
                    <vs-th sort-key="key" style="width: 40%;">Key</vs-th>
                    <vs-th >Action</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].id">
                            {{data[indextr].id}}
                        </vs-td>
                        <vs-td style="width: 40%;" :data="data[indextr].name">
                            {{data[indextr].name}}
                        </vs-td>
                        <vs-td style="width: 40%;" :data="data[indextr].key">
                            {{data[indextr].key}}
                        </vs-td>
                        <vs-td>
                            <vs-row>
                                <vs-button :disabled="data[indextr].key == 'en'" @click="editLanguage(data[indextr])" class="mr-2" color="primary" type="border" icon-pack="feather" icon="icon-edit"></vs-button>
                                <vs-button :disabled="data[indextr].key == 'en'" @click="deleteLanguage(data[indextr])" color="danger" type="filled" icon-pack="feather" icon="icon-trash"></vs-button>
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

            <vs-popup  classContent="popup-example h-full" title="Add Language" :active.sync="activePromptAddLanguage">
                <div id="createLanguageLoadingDiv" class="vs-con-loading__container">
                    <form data-vv-scope="addLanguageForm">
                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input class="w-full" v-validate="'required'" v-model="add_language.name" name="name" label="Language" height="200" />
                                <span class="text-danger text-sm" v-show="errors.has('addLanguageForm.name')">{{ errors.first('addLanguageForm.name') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input class="w-full" v-validate="'required|length:2'" v-model="add_language.key" name="key" label="Key" />
                                <span class="text-danger text-sm" v-show="errors.has('addLanguageForm.key')">{{ errors.first('addLanguageForm.key') }}</span>
                            </div>
                        </div>

                        <div align="right" class="vx-row">
                            <div  class="vx-col w-full mb-2">
                                <vs-button  v-on:click.prevent="createLanguage()" color="primary" type="filled">Save Language</vs-button>
                            </div>
                        </div>
                    </form>
                </div>
            </vs-popup>

            <vs-popup  classContent="popup-example h-full" title="Edit Language" :active.sync="activePromptEditLanguage">
                <div id="editLanguageLoadingDiv" class="vs-con-loading__container">
                    <form data-vv-scope="editLanguageForm">
                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input class="w-full" v-validate="'required'" v-model="edit_language.name" name="name" label="Language" height="200" />
                                <span class="text-danger text-sm" v-show="errors.has('editLanguageForm.name')">{{ errors.first('editLanguageForm.name') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input class="w-full" v-validate="'required|length:2'" v-model="edit_language.key" name="key" label="Key" />
                                <span class="text-danger text-sm" v-show="errors.has('editLanguageForm.key')">{{ errors.first('editLanguageForm.key') }}</span>
                            </div>
                        </div>

                        <div align="right" class="vx-row mt-8 mt-base">
                            <div  class="vx-col w-full mb-2">
                                <vs-button  v-on:click.prevent="updateLanguage()" color="primary" type="filled">Update Language</vs-button>
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
            languages: [],
            add_language: {
                name : null,
                key : null,
            },
            edit_language: {
                name : null,
                key : null,
            },
            image : [],
            fileRecordsForUpload: [],
            activePromptAddLanguage : false,
            activePromptEditLanguage : false,
            deleteLanguageData : null,
            editLanguageData : null,
        }
    },
    watch: {
        currentPage(val) {
            this.searchLanguages()
        }
    },
    methods: {
        redirectToLanguagePath(path){
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
        deleteLanguage(language) {
            this.deleteLanguageData = language;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Are you sure to delete this language data ?',
                accept: this.acceptDeleteLanguage
            })
        },
        acceptDeleteLanguage() {
            this.$vs.loading();

            this.$store.dispatch("placeManagement/deleteLanguage", { id : this.deleteLanguageData.id})
                .then(res => { 
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: "Success.",
                        text: "Language deleted successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });
                })
                .catch(err => { 
                  this.$vs.loading.close()
                })
        },
        editLanguage(language) {
            this.image = [];
            this.edit_language = language;
            this.deleteLanguageData = language;
            this.activePromptEditLanguage = true
        },
        addLanguage() {
            this.image = [];
            this.activePromptAddLanguage = true
        },
        createLanguage() {
            this.$validator.validateAll('addLanguageForm').then(result => {
                if (result) this.createLanguageApi()
            })
        },
        createLanguageApi() {
            var self = this 
            this.$vs.loading({
              container: '#createLanguageLoadingDiv',
              scale: 0.6
            })

            this.$store.dispatch("placeManagement/createLanguage", this.add_language)
                .then(res => { 
                    this.$vs.loading.close('#createLanguageLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: "Success.",
                        text: "Language created successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });

                    this.add_language = {
                        language : null,
                    };

                    this.activePromptAddLanguage = false;
                })
                .catch(err => { 
                    this.$vs.loading.close('#createLanguageLoadingDiv > .con-vs-loading')

                    Object.keys(err.data.errors).forEach(function(key) {
                        self.errors.add({
                            field: key,
                            scope: "addLanguageForm",
                            msg: err.data.errors[key][0],
                        });
                    });
                })
        },
        updateLanguage() {
            this.$validator.validateAll('editLanguageForm').then(result => {
                if (result) this.updateLanguageApi()
            })
        },
        updateLanguageApi() {
            var self = this 

            this.$vs.loading({
              container: '#editLanguageLoadingDiv',
              scale: 0.6
            })

            this.$store.dispatch("placeManagement/updateLanguage", this.edit_language)
                .then(res => { 
                    this.$vs.loading.close('#editLanguageLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: "Success.",
                        text: "Language updated successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });

                    this.edit_language = {
                        name : null,
                        price : null,
                    };

                    this.activePromptEditLanguage = false;
                })
                .catch(err => { 
                    this.$vs.loading.close('#editLanguageLoadingDiv > .con-vs-loading')

                    Object.keys(err.data.errors).forEach(function(key) {
                        self.errors.add({
                            field: key,
                            scope: "editLanguageForm",
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
                this.searchLanguages()
            }, 2000);   
        },
        handleChangePage(page) {
            // this.searchUser()
        },
        handleSort(key, active) {
            if(key){
                this.key = key
                this.active = active
                this.searchLanguages()
            }
        },
        async searchLanguages() {
            var self = this
            this.$vs.loading({
                container: '#viewLanguageLoadingDiv',
                scale: 0.6
            })

            await this.$store.dispatch("placeManagement/viewLanguage", { search : this.search, sort : this.key, sort_key : this.active, page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                    this.$vs.loading.close('#viewLanguageLoadingDiv > .con-vs-loading')
                })
                .catch(err => { 
                    this.$vs.loading.close('#viewLanguageLoadingDiv > .con-vs-loading')
                })

                this.languages = this.$store.state.placeManagement.languages
        },
        async viewLanguages() {
            var self = this

            await this.$store.dispatch("placeManagement/viewLanguage", {page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                })

            this.languages = this.$store.state.placeManagement.languages
        },
    },
    mounted() {
        this.languages = this.$store.state.placeManagement.languages
    },
    async created() {
        if(!modulePlaceManagement.isRegistered) {
            this.$store.registerModule('placeManagement', modulePlaceManagement)
            modulePlaceManagement.isRegistered = true
        }

        await this.viewLanguages() 
    },
}
</script>
<style type="text/css">
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.vs-con-textarea{
    height: 400px;
}

.vs-textarea {
    height: 100%;
}

</style>

