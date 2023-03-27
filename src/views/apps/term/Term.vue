<template>
    <vx-card title="Terms & Conditions">
        <div id="viewTermLoadingDiv" class="vs-con-loading__container">
            <vs-table :sst="true"
                @search="handleSearch"
                @change-page="handleChangePage"
                @sort="handleSort"
                v-model="selected"
                search
                :data="terms">

                <template slot="header">
                    <div class="flex flex-wrap items-center w-full">
                        <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addTerm">Add Term</vs-button>
                    </div>
                </template>

                <template slot="thead">
                    <vs-th sort-key="id">Id</vs-th>
                    <vs-th sort-key="terms" style="width: 80%;">Terms</vs-th>
                    <vs-th >Action</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].id">
                            {{data[indextr].id}}
                        </vs-td>
                        <vs-td style="width: 80%;" :data="data[indextr].terms">
                            {{data[indextr].terms}}
                        </vs-td>
                        <vs-td>
                            <vs-row>
                                <vs-button @click="editTerm(data[indextr])" class="mr-2" color="primary" type="border" icon-pack="feather" icon="icon-edit"></vs-button>
                                <vs-button @click="deleteTerm(data[indextr])" color="danger" type="filled" icon-pack="feather" icon="icon-trash"></vs-button>
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

            <vs-popup  classContent="popup-example h-full" title="Add Term" :active.sync="activePromptAddTerm">
                <div id="createTermLoadingDiv" class="vs-con-loading__container">
                    <form data-vv-scope="addTermForm">
                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-textarea v-validate="'required'" v-model="add_term.terms" name="terms" label="Term" height="200" />
                                <span class="text-danger text-sm" v-show="errors.has('addTermForm.terms')">{{ errors.first('addTermForm.terms') }}</span>
                            </div>
                        </div>

                        <div align="right" class="vx-row">
                            <div  class="vx-col w-full mb-2">
                                <vs-button  v-on:click.prevent="createTerm()" color="primary" type="filled">Save Term</vs-button>
                            </div>
                        </div>
                    </form>
                </div>
            </vs-popup>

            <vs-popup  classContent="popup-example h-full" title="Edit Term" :active.sync="activePromptEditTerm">
                <div id="editTermLoadingDiv" class="vs-con-loading__container">
                    <form data-vv-scope="editTermForm">
                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-textarea v-validate="'required'" v-model="edit_term.terms" name="terms" label="Term" height="200" />
                                <span class="text-danger text-sm" v-show="errors.has('editTermForm.terms')">{{ errors.first('editTermForm.terms') }}</span>
                            </div>
                        </div>

                        <div align="right" class="vx-row mt-8 mt-base">
                            <div  class="vx-col w-full mb-2">
                                <vs-button  v-on:click.prevent="updateTerm()" color="primary" type="filled">Update Term</vs-button>
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
            terms: [],
            add_term: {
                terms : null,
            },
            edit_term: {
                terms : null,
            },
            image : [],
            fileRecordsForUpload: [],
            activePromptAddTerm : false,
            activePromptEditTerm : false,
            deleteTermData : null,
            editTermData : null,
        }
    },
    watch: {
        currentPage(val) {
            this.searchTerms()
        }
    },
    mounted() {
        this.terms = this.$store.state.placeManagement.terms
    },
    methods: {
        redirectToTermPath(path){
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
        deleteTerm(term) {
            this.deleteTermData = term;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Are you sure to delete this term data ?',
                accept: this.acceptDeleteTerm
            })
        },
        acceptDeleteTerm() {
            this.$vs.loading();

            this.$store.dispatch("placeManagement/deleteTerm", { id : this.deleteTermData.id})
                .then(res => { 
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: "Success.",
                        text: "Term deleted successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });
                })
                .catch(err => { 
                  this.$vs.loading.close()
                })
        },
        editTerm(term) {
            this.image = [];
            this.edit_term = term;
            this.deleteTermData = term;
            this.activePromptEditTerm = true
        },
        addTerm() {
            this.image = [];
            this.activePromptAddTerm = true
        },
        createTerm() {
            this.$validator.validateAll('addTermForm').then(result => {
                if (result) this.createTermApi()
            })
        },
        createTermApi() {
            var self = this 
            this.$vs.loading({
              container: '#createTermLoadingDiv',
              scale: 0.6
            })

            this.$store.dispatch("placeManagement/createTerm", this.add_term)
                .then(res => { 
                    this.$vs.loading.close('#createTermLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: "Success.",
                        text: "Term created successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });

                    this.add_term = {
                        term : null,
                    };

                    this.activePromptAddTerm = false;
                })
                .catch(err => { 
                    this.$vs.loading.close('#createTermLoadingDiv > .con-vs-loading')

                    Object.keys(err.data.errors).forEach(function(key) {
                        self.errors.add({
                            field: key,
                            scope: "addTermForm",
                            msg: err.data.errors[key][0],
                        });
                    });
                })
        },
        updateTerm() {
            this.$validator.validateAll('editTermForm').then(result => {
                if (result) this.updateTermApi()
            })
        },
        updateTermApi() {
            var self = this 

            this.$vs.loading({
              container: '#editTermLoadingDiv',
              scale: 0.6
            })

            this.$store.dispatch("placeManagement/updateTerm", this.edit_term)
                .then(res => { 
                    this.$vs.loading.close('#editTermLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: "Success.",
                        text: "Term updated successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });

                    this.edit_term = {
                        name : null,
                        price : null,
                    };

                    this.activePromptEditTerm = false;
                })
                .catch(err => { 
                    this.$vs.loading.close('#editTermLoadingDiv > .con-vs-loading')

                    Object.keys(err.data.errors).forEach(function(key) {
                        self.errors.add({
                            field: key,
                            scope: "editTermForm",
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
                this.searchTerms()
            }, 2000);   
        },
        handleChangePage(page) {
            // this.searchUser()
        },
        handleSort(key, active) {
            if(key){
                this.key = key
                this.active = active
                this.searchTerms()
            }
        },
        async searchTerms() {
            var self = this
            this.$vs.loading({
                container: '#viewTermLoadingDiv',
                scale: 0.6
            })

            await this.$store.dispatch("placeManagement/viewTerm", { search : this.search, sort : this.key, sort_key : this.active, page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                    this.$vs.loading.close('#viewTermLoadingDiv > .con-vs-loading')
                })
                .catch(err => { 
                    this.$vs.loading.close('#viewTermLoadingDiv > .con-vs-loading')
                })

                this.terms = this.$store.state.placeManagement.terms
        },
        async viewTerms() {
            var self = this

            await this.$store.dispatch("placeManagement/viewTerm", {page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                })

            this.terms = this.$store.state.placeManagement.terms
        },
    },
    async created() {
        if(!modulePlaceManagement.isRegistered) {
            this.$store.registerModule('placeManagement', modulePlaceManagement)
            modulePlaceManagement.isRegistered = true
        }

        await this.viewTerms() 
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

