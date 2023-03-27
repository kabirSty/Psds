<template>
    <vx-card title="Contacts">
        <div id="viewContactLoadingDiv" class="vs-con-loading__container">
            <vs-table :sst="true"
                @search="handleSearch"
                @change-page="handleChangePage"
                @sort="handleSort"
                v-model="selected"
                search
                :data="contacts">

                <template slot="header">
                    <div class="flex flex-wrap items-center w-full">
                        <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addContact">Add Contact</vs-button>
                    </div>
                </template>

                <template slot="thead">
                    <vs-th sort-key="id">Id</vs-th>
                    <vs-th sort-key="name">Name</vs-th>
                    <vs-th sort-key="phone">Phone</vs-th>
                    <vs-th >Action</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].id">
                            {{data[indextr].id}}
                        </vs-td>
                        <vs-td :data="data[indextr].name">
                            {{data[indextr].name}}
                        </vs-td>
                        <vs-td :data="data[indextr].phone">
                            {{data[indextr].phone}}
                        </vs-td>
                        <vs-td>
                            <vs-row>
                                <vs-button @click="editContact(data[indextr])" class="mr-2" color="primary" type="border" icon-pack="feather" icon="icon-edit"></vs-button>
                                <vs-button @click="deleteContact(data[indextr])" color="danger" type="filled" icon-pack="feather" icon="icon-trash"></vs-button>
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

            <vs-popup  classContent="popup-example h-full" title="Add Contact" :active.sync="activePromptAddContact">
                <div id="createContactLoadingDiv" class="vs-con-loading__container">
                    <form data-vv-scope="addContactForm">
                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required'" placeholder="Contact name" name="name" v-model="add_contact.name" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('addContactForm.name')">{{ errors.first('addContactForm.name') }}</span>
                            </div>
                        </div>

                         <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required|numeric'" placeholder="Contact phone" name="phone" v-model="add_contact.phone" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('addContactForm.phone')">{{ errors.first('addContactForm.phone') }}</span>
                            </div>
                        </div>

                        <div align="right" class="vx-row">
                            <div  class="vx-col w-full mb-2">
                                <vs-button  v-on:click.prevent="createContact()" color="primary" type="filled">Save Contact</vs-button>
                            </div>
                        </div>
                    </form>
                </div>
            </vs-popup>

            <vs-popup  classContent="popup-example h-full" title="Edit Contact" :active.sync="activePromptEditContact">
                <div id="editContactLoadingDiv" class="vs-con-loading__container">
                    <form data-vv-scope="editContactForm">
                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required'" placeholder="Contact name" name="name" v-model="edit_contact.name" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('editContactForm.name')">{{ errors.first('editContactForm.name') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-2">
                            <div class="vx-col w-full mb-2">
                                <vs-input v-validate="'required|numeric'" placeholder="Contact phone" name="phone" v-model="edit_contact.phone" class="mt-5 w-full" />
                                <span class="text-danger text-sm" v-show="errors.has('editContactForm.phone')">{{ errors.first('editContactForm.phone') }}</span>
                            </div>
                        </div>

                        <div align="right" class="vx-row mt-8 mt-base">
                            <div  class="vx-col w-full mb-2">
                                <vs-button  v-on:click.prevent="updateContact()" color="primary" type="filled">Update Contact</vs-button>
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
            contacts: [],
            add_contact: {
                name : null,
                phone : null,
            },
            edit_contact: {
                name : null,
                phone : null,
            },
            activePromptAddContact : false,
            activePromptEditContact : false,
            deleteContactData : null,
            editContactData : null,
        }
    },
    watch: {
        currentPage(val) {
            this.searchContacts()
        }
    },
    mounted() {
        this.contacts = this.$store.state.placeManagement.contacts
    },
    methods: {
        deleteContact(contact) {
            this.deleteContactData = contact;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Are you sure to delete this contact data ?',
                accept: this.acceptDeleteContact
            })
        },
        acceptDeleteContact() {
            this.$vs.loading();

            this.$store.dispatch("placeManagement/deleteContact", { id : this.deleteContactData.id})
                .then(res => { 
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: "Success.",
                        text: "Contact deleted successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });
                })
                .catch(err => { 
                  this.$vs.loading.close()
                })
        },
        editContact(contact) {
            this.edit_contact = contact;
            this.deleteContactData = contact;
            this.activePromptEditContact = true
        },
        addContact() {
            this.activePromptAddContact = true
        },
        createContact() {
            this.$validator.validateAll('addContactForm').then(result => {
                if (result) this.createContactApi()
            })
        },
        createContactApi() {
            var self = this 
            this.$vs.loading({
              container: '#createContactLoadingDiv',
              scale: 0.6
            })

            this.$store.dispatch("placeManagement/createContact", this.add_contact)
                .then(res => { 
                    this.$vs.loading.close('#createContactLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: "Success.",
                        text: "Contact created successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });

                    this.add_contact = {
                        name : null,
                        price : null,
                    };

                    this.activePromptAddContact = false;
                })
                .catch(err => { 
                    this.$vs.loading.close('#createContactLoadingDiv > .con-vs-loading')

                    Object.keys(err.data.errors).forEach(function(key) {
                        self.errors.add({
                            field: key,
                            scope: "addContactForm",
                            msg: err.data.errors[key][0],
                        });
                    });
                })
        },
        updateContact() {
            this.$validator.validateAll('editContactForm').then(result => {
                if (result) this.updateContactApi()
            })
        },
        updateContactApi() {
            var self = this 

            this.$vs.loading({
              container: '#editContactLoadingDiv',
              scale: 0.6
            })

            this.$store.dispatch("placeManagement/updateContact", this.edit_contact)
                .then(res => { 
                    this.$vs.loading.close('#editContactLoadingDiv > .con-vs-loading')
                    this.$vs.notify({
                        title: "Success.",
                        text: "Contact updated successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });

                    this.edit_contact = {
                        name : null,
                        price : null,
                    };

                    this.activePromptEditContact = false;
                })
                .catch(err => { 
                    this.$vs.loading.close('#editContactLoadingDiv > .con-vs-loading')

                    Object.keys(err.data.errors).forEach(function(key) {
                        self.errors.add({
                            field: key,
                            scope: "editContactForm",
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
                this.searchContacts()
            }, 2000);   
        },
        handleChangePage(page) {
            // this.searchUser()
        },
        handleSort(key, active) {
            if(key){
                this.key = key
                this.active = active
                this.searchContacts()
            }
        },
        async searchContacts() {
            var self = this
            this.$vs.loading({
                container: '#viewContactLoadingDiv',
                scale: 0.6
            })

            await this.$store.dispatch("placeManagement/viewContacts", { search : this.search, sort : this.key, sort_key : this.active, page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                    this.$vs.loading.close('#viewContactLoadingDiv > .con-vs-loading')
                })
                .catch(err => { 
                    this.$vs.loading.close('#viewContactLoadingDiv > .con-vs-loading')
                })

                this.contacts = this.$store.state.placeManagement.contacts
        },
        async viewContacts() {
            var self = this

            await this.$store.dispatch("placeManagement/viewContacts", {page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                })

            this.contacts = this.$store.state.placeManagement.contacts

            console.log(this.contacts)
        },
    },
    async created() {
        if(!modulePlaceManagement.isRegistered) {
            this.$store.registerModule('placeManagement', modulePlaceManagement)
            modulePlaceManagement.isRegistered = true
        }

        await this.viewContacts() 
    },
}
</script>
