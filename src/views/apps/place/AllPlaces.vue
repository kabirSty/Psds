<template>
    <vx-card title="Places">
        <div id="viewPlaceLoadingDiv" class="vs-con-loading__container">
            <vs-table :sst="true"
                @search="handleSearch"
                @change-page="handleChangePage"
                @sort="handleSort"
                v-model="selected"
            
                :data="places">

                <template slot="header">
                    <div class="flex flex-wrap items-center w-full">
                        <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addPlace">Add a Place</vs-button>

                        <treeselect placeholder="Place Type" style="width: 200px;" @input="searchPlaces" class="ml-4" v-model="selected_place_type" :multiple="false" :options="place_types" />

                        <vs-input style="width: 200px;" class="ml-4" placeholder="Name" v-model="selected_place_name" />

                        <vs-input style="width: 200px;" class="ml-4" placeholder="Location" v-model="selected_place_location" />

                        <vs-button color="primary" class="ml-4" type="filled" icon-pack="feather" icon="icon-search" @click="searchPlaces">Search</vs-button>
                    </div>
                </template>

                <template slot="thead">
                    <vs-th sort-key="id">Id</vs-th>
                    <vs-th sort-key="type">Type</vs-th>
                    <vs-th style="width: 20%;">Name</vs-th>
                    <vs-th style="width: 40%;">Location</vs-th>
                    <vs-th >Image</vs-th>
                    <vs-th >Action</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].id">
                            {{data[indextr].id}}
                        </vs-td>
                        <vs-td :data="data[indextr].type">
                            {{data[indextr].type}}
                        </vs-td>
                        <vs-td style="width: 20%;" :data="data[indextr].name">
                            {{data[indextr].name.en ? data[indextr].name.en : ''}}
                        </vs-td>
                        <vs-td style="width: 40%;" :data="data[indextr].location">
                            {{data[indextr].location && data[indextr].location.place_name ? data[indextr].location.place_name : ''}}
                        </vs-td>
                        <vs-td :data="data[indextr].images">
                            <img v-if="data[indextr].images.length" width="50" :src="data[indextr].images[0].file_path">
                        </vs-td>
                        <vs-td>
                            <vs-row>
                                <vs-button @click="editPlace(data[indextr])" class="mr-2" color="primary" type="border" icon-pack="feather" icon="icon-edit"></vs-button>
                                <vs-button @click="deletePlace(data[indextr])" color="danger" type="filled" icon-pack="feather" icon="icon-trash"></vs-button>
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
        </div>
    </vx-card>
</template>

<script>
import vSelect from 'vue-select'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import modulePlaceManagement from '@/store/place-management/modulePlaceManagement.js'

export default {
    components: {
        vSelect,
        Treeselect,
    },
    data() {
        return {
            selected:[],
            key : null, 
            active : null,
            search : null,
            totalPage: 1,
            currentPage: 1,
            places: [],
            deletePlaceData : null,
            selected_place_name : null,
            selected_place_location : null,
            selected_place_type : "all",
            place_types : [
                { id : 'all', label : 'All' },
                { id : 'place', label : 'Place' },
                { id : 'event', label : 'Event' },
                { id : 'tip', label : 'Tip' },
            ],
        }
    },
    watch: {
        currentPage(val) {
            this.searchPlaces()
        }
    },
    mounted() {
        this.places = this.$store.state.placeManagement.places
    },
    methods: {
        changePlaceType(place) {


        },
        deletePlace(place) {
            this.deletePlaceData = place;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Are you sure to delete this place data ?',
                accept: this.acceptDeletePlace
            })
        },
        acceptDeletePlace() {
            this.$vs.loading();

            this.$store.dispatch("placeManagement/deletePlace", { id : this.deletePlaceData.id})
                .then(res => { 
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: "Success.",
                        text: "Place deleted successfully.",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success"
                    });
                })
                .catch(err => { 
                  this.$vs.loading.close()
                })
        },
        editPlace(place) {
            this.$router.push("/places/"+place.id).catch(() => {})
        },
        addPlace() {
            this.$router.push("/places/add").catch(() => {})
        },
        handleSearch(searching) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(() => {
                this.search = searching
                this.searchPlaces()
            }, 2000);   
        },
        handleChangePage(page) {
            // this.searchUser()
        },
        handleSort(key, active) {
            if(key){
                this.key = key
                this.active = active
                this.searchPlaces()
            }
        },
        async searchPlaces() {
            var self = this
            this.$vs.loading({
                container: '#viewPlaceLoadingDiv',
                scale: 0.6
            })

            let data = { 
                name : this.selected_place_name, 
                location : this.selected_place_location, 
                sort : this.key, 
                sort_key : this.active, 
                page : this.currentPage,
                place_type : this.selected_place_type,
            }

            await this.$store.dispatch("placeManagement/viewPlace", data)
                .then(res => { 
                    this.totalPage = res.data.last_page
                    this.$vs.loading.close('#viewPlaceLoadingDiv > .con-vs-loading')
                })
                .catch(err => { 
                    this.$vs.loading.close('#viewPlaceLoadingDiv > .con-vs-loading')
                })

                this.places = this.$store.state.placeManagement.places
        },
        async viewPlaces() {
            var self = this

            await this.$store.dispatch("placeManagement/viewPlace", {page : this.currentPage})
                .then(res => { 
                    this.totalPage = res.data.last_page
                })

            this.places = this.$store.state.placeManagement.places
        },
    },
    async created() {
        if(!modulePlaceManagement.isRegistered) {
            this.$store.registerModule('placeManagement', modulePlaceManagement)
            modulePlaceManagement.isRegistered = true
        }

        await this.viewPlaces() 
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

