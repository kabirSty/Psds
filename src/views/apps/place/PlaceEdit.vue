<template>
  <div id="page-place-edit">

    <vs-alert color="danger" title="Place Not Found" :active.sync="place_not_found">
      <span>Place record with id: {{ $route.params.placeId }} not found or not a valid Place. </span>
      <span>
        <span>Check </span><router-link :to="{name:'Places'}" class="text-inherit underline">All Place</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="place_data" title="Edit a Place">
      <place-edit-data :data="place_data" />
    </vx-card>
  </div>
</template>

<script>
import PlaceEditData from "./PlaceEditData.vue"
import modulePlaceManagement from '@/store/place-management/modulePlaceManagement.js'

export default {
  components: {
    PlaceEditData,
  },
  data() {
    return {
      place_data: null,
      place_not_found: false,
      activeTab: 0,
    }
  },
  watch: {
    activeTab() {
      this.fetch_place_data(this.$route.params.placeId)
    }
  },
  methods: {
    fetch_place_data(placeId) {
      this.$store.dispatch("placeManagement/viewPlace", {id : placeId})
        .then(res => { 
          if(res.data){
            let roleIds = []
            let roleNames = []
            this.place_data = res.data;
          }
          else this.place_not_found = true
        })
        .catch(err => {
          this.place_not_found = true
          return 
        })
    },
  },
  created() {
    if(!modulePlaceManagement.isRegistered) {
      this.$store.registerModule('placeManagement', modulePlaceManagement)
      modulePlaceManagement.isRegistered = true
    }

    this.fetch_place_data(this.$route.params.placeId)
  }
}

</script>
[
    {
        "lat": null,
        "lng": null,
        "www": "http://www.audika.dk",
        "email": "mailto:info@audika.dk",
        "phone": "70400200",
        "address": "Finsensvej 45B \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t2000 \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tFrederiksberg\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t",
        "opening_hours": []
    }
]0767377574