<template>
  <div id="dashboard-analytics">
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="UsersIcon"
            icon-right
            :statistic="users_count"
            statisticTitle="Users" />
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="LayersIcon"
            icon-right
            :statistic="cats_count"
            statisticTitle="Categories"
            color="success" />
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="MapPinIcon"
            icon-right
            :statistic="places_count"
            statisticTitle="Places"
            color="danger" />
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="PhoneCallIcon"
            icon-right
            :statistic="contacts_count"
            statisticTitle="Contacts"
            color="warning" />
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="LayersIcon"
            :statistic="groups_count"
            statisticTitle="Groups" 
            color="primary"  />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="ItalicIcon"
            statisticTitle="Comments"
            :statistic="lang_count"
            color='success' />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="ShoppingBagIcon"
            statistic="978"
            statisticTitle="Orders"
            color='warning' />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="HeartIcon"
            statistic="26.8k"
            statisticTitle="Favorited"
            color='danger' />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="SmileIcon"
            statistic="689"
            statisticTitle="Reviews"
            color='success' />
      </div>

      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="TruckIcon"
            statistic="2"
            statisticTitle="Returns"
            color='warning' />
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-full mb-base">
        <vx-card title="">
          <vue-apex-charts ref="mixedChart" type="area" height="350" :options="mixedChart.chartOptions" :series="mixedChart.series"></vue-apex-charts>
        </vx-card>
      </div>
    </div>

    
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import modulePlaceManagement from '@/store/place-management/modulePlaceManagement.js'
import moduleRoleManagement from '@/store/role-management/moduleRoleManagement.js'

export default {
    components: {
      StatisticsCardLine,
      VueApexCharts
    },
    data() {
        return {
          users_count : 0,
          cats_count : 0,
          places_count : 0,
          contacts_count : 0,
          groups_count : 0,
          lang_count : 0,
          mixedChart: {
            series: [],
            chartOptions: {
              colors: ['#00A99D', '#A7006D', '#EA5455', '#FF9F43', '#1E1E1E'],
              chart: {
                stacked: false,
              },
              stroke: {
                width: [2, 2],
                curve: 'smooth'
              },
              plotOptions: {
                bar: {
                  columnWidth: '50%'
                }
              },

              fill: {
                opacity: [1, 1, 1],
                gradient: {
                  inverseColors: false,
                  shade: 'light',
                  type: "vertical",
                  opacityFrom: 0.85,
                  opacityTo: 0.55,
                  stops: [0, 100, 100, 100]
                }
              },
              labels: [],
              markers: {
                size: 0
              },
              xaxis: {
                type: 'datetime',
                tooltip: {
                  format: 'MM yyyy'
                },
                // labels: {
                //  format: 'MM yyyy'
                // }
              },
              yaxis: {
                title: {
                  text: 'Number of users signup per month',
                },
                min: 0
              },
              tooltip: {
                shared: true,
                intersect: false,
              }
            }
          },
        }
    },
    methods: {
      
    },
    mounted() {
    
    },
    async created() {
      if(!moduleRoleManagement.isRegistered) {
        this.$store.registerModule('roleManagement', moduleRoleManagement)
        moduleRoleManagement.isRegistered = true
      }

      if(!modulePlaceManagement.isRegistered) {
          this.$store.registerModule('placeManagement', modulePlaceManagement)
          modulePlaceManagement.isRegistered = true
      }

      await this.$store.dispatch("roleManagement/viewUser")
        .then(res => { 
          if(res.status == 201) this.users_count = res.data.total
        })

      await this.$store.dispatch("placeManagement/viewCategory")
        .then(res => { 
          if(res.status == 200) this.cats_count = res.data.total
        })

      await this.$store.dispatch("placeManagement/viewPlace")
        .then(res => { 
          if(res.status == 200) this.places_count = res.data.total
        })

      await this.$store.dispatch("placeManagement/viewContacts")
        .then(res => { 
          if(res.status == 200) this.contacts_count = res.data.total
        })

      await this.$store.dispatch("placeManagement/viewGroup")
        .then(res => { 
          if(res.status == 200) this.groups_count = res.data.total
        })

      await this.$store.dispatch("placeManagement/viewLanguage")
        .then(res => { 
          if(res.status == 200) this.lang_count = res.data.total
        })
    } 
}
</script>

<style lang="scss">
/*! rtl:begin:ignore */
#dashboard-analytics {
  .greet-user{
    position: relative;

    .decore-left{
      position: absolute;
      left:0;
      top: 0;
    }
    .decore-right{
      position: absolute;
      right:0;
      top: 0;
    }
  }

  @media(max-width: 576px) {
    .decore-left, .decore-right{
      width: 140px;
    }
  }
}
/*! rtl:end:ignore */
</style>
