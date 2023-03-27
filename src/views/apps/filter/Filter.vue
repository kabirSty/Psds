<template>
  <div id="page-user-list">
    <div class="vx-card p-6">
      <div id="filterLoadingDiv" class="vs-con-loading__container">
      <vs-table
          :sst="true"
          @search="handleSearch"
          @change-page="handleChangePage"
          @sort="handleSort"
          v-model="selected"
          search
          :data="filters">

          <template slot="header">
             <div class="flex flex-wrap items-center w-full">
                <vs-button class="mb-4 md:mb-0 mr-2" type="filled" icon-pack="feather" icon="icon-download" @click="gridApi.exportDataAsCsv()"></vs-button>
                <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addUser()">Add Filter</vs-button>
            </div>
          </template>

          <template slot="thead">
              <vs-th>Name</vs-th>
              <vs-th sort-key="key">Key</vs-th>
              <vs-th style="width: 50%;">Options</vs-th>
              <vs-th>Action</vs-th>
          </template>

          <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].name" >
                      <span class="ml13 sm:text-1em mb-4" v-html="data[indextr].name.en"></span>
                  </vs-td>
                  <vs-td :data="data[indextr].key" >
                      <span class="ml13 sm:text-1em mb-4" v-html="data[indextr].key"></span>
                  </vs-td>
                  <vs-td style="width: 50%;" :data="data[indextr].options">
                    <div v-for="(option, optionIndex) in data[indextr].options">
                      <vs-chip  color="primary" class="product-order-status">
                        {{ option.options.en ? option.options.en : option.options[Object.keys(option.options)[0]] }}
                      </vs-chip>
                    </div>
                  </vs-td>
                  <vs-td :data="data[indextr].name" >
                      <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
                        <feather-icon icon="EditIcon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord(data[indextr])" />
                        <feather-icon icon="TrashIcon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="confirmDeleteRecord(data[indextr])" />
                      </div>
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>

      <div class="vx-row mt-base">
          <div class="vx-col w-full mb-2">
              <vs-pagination :total="totalPage" v-model="currentPage"></vs-pagination>
          </div>
      </div>

      <vs-popup  classContent="popup-example h-full" title="Create Filter" :active.sync="activePromptAddFilter">
        <div id="createFilterLoadingDiv" class="vs-con-loading__container" v-if="create_filters.length">
          <vs-tabs color="primary" v-model="activeTab">
            <vs-tab active :label="create_filter.language" v-for="(create_filter, languageIndex) in create_filters">
              <form :data-vv-scope="'addFilterForm_'+languageIndex">
                <div class="vx-row">
                  <div class="vx-col sm:w-full mb-2">
                    <vs-input class="w-full" v-validate="'required'" label-placeholder="Name" :ref="'name_'+languageIndex" :name="'name_'+languageIndex" v-model="create_filter.name"/>
                    <span class="text-danger text-sm"  v-show="errors.has('addFilterForm_'+languageIndex+'.name_'+languageIndex)">This field is required</span>
                  </div>
                </div>

                <vs-divider position="left"> Filter options </vs-divider>

                <div class="flex flex-wrap items-center justify-end vx-row mb-2">
                  <div class="vx-col sm:w-full w-full flex flex-wrap items-center justify-end">
                    <vs-button @click="addFilterOptionFun(languageIndex)" class="ml-4" >Add Filter Option</vs-button>
                  </div>
                </div>

                <div class="vx-row mb-2" v-for="(optionData, optionIndex) in create_filter.options">
                  <div class="vx-col w-5/12 mb-2 pr-0">
                    <vs-input class="w-full" v-validate="'required'" placeholder="Filter Option" :name="'options_'+optionIndex" v-model="create_filter.options[optionIndex]"/>
                    <span class="text-danger text-sm"  v-show="errors.has('addFilterForm_'+languageIndex+'.options_'+optionIndex)">This field is required</span>
                  </div>
                  <div class="vx-col w-6/12 mb-2 px-0">
                    <vs-input class="w-full" v-validate="'required'"  placeholder="Filter Icon" :name="'icons_'+optionIndex" v-model="create_filter.icons[optionIndex]"/>
                    <span class="text-danger text-sm"  v-show="errors.has('addFilterForm_'+languageIndex+'.icons_'+optionIndex)">This field is required</span>
                  </div>
                  <div class="vx-col w-1/12 mb-2 pl-0">
                      <vs-button  @click="removeFilterOptionFun(languageIndex, optionIndex)"  class="" color="danger" type="filled" icon-pack="feather" icon="icon-x"></vs-button>
                  </div>
                </div>
                <a href="https://pictogrammers.github.io/@mdi/font/5.4.55" target="_blank">Material Design Icons</a>

<!--                 <div class="vx-row mt-4 mb-base">
                  <div class="vx-col sm:w-full mb-2">
                    <v-select v-model="create_filter.options" v-validate="'required'" :ref="'options_'+languageIndex" :name="'options_'+languageIndex" taggable placeholder="Add filter options"  multiple  :options="[]"></v-select>
                    <span class="text-danger text-sm"  v-show="errors.has('addFilterForm_'+languageIndex+'.options_'+languageIndex)">This field is required</span>
                  </div>
                </div>

                <div class="vx-row mb-2" >
                  <div class="vx-col sm:w-full mb-2">
                    <a href="https://pictogrammers.github.io/@mdi/font/5.4.55" target="_blank">Material Design Icons</a>
                    <v-select   v-model="create_filter.icons" v-validate="'required|length:'+create_filter.options.length" ref="icons" name="icons" taggable placeholder="Add filter icons"  multiple  :options="[]"></v-select>
                    <span class="text-danger text-sm" v-show="errors.has('addFilterForm_'+languageIndex+'.icons')">{{ errors.first('addFilterForm_'+languageIndex+'.icons') }}</span>
                  </div>
                </div> -->
              </form>
            </vs-tab>
          </vs-tabs>

          <vs-divider />

          <div class="vx-row px-3">
            <div class="vx-col sm:w-full mb-2">
              <form data-vv-scope="addFilterForm">
                <vs-input class="w-full" v-validate="'required|alpha'" label-placeholder="Key" ref="key" name="key" v-model="create_filter_key"/>
                <span class="text-danger text-sm" v-show="errors.has('addFilterForm.key')">This field is invalid</span>
              </form>
            </div>
          </div>
          
          <div  class="vx-row mt-4">
            <div  class="vx-col w-1/2 mb-2">
            </div>
            <div  class="vx-col w-1/2 mb-2" align="right">
              <vs-button  v-on:click.prevent="validateAddCatForm()" color="primary" type="filled">Create Filter</vs-button>
            </div>
          </div>
        </div>
      </vs-popup>

      <vs-popup  classContent="popup-example h-full" title="Update Filter" :active.sync="activePromptEditFilter">
        <div id="updateFilterLoadingDiv" class="vs-con-loading__container">
          <vs-tabs color="primary" v-if="update_filters.length" v-model="activeEditTab">
            <vs-tab active :label="update_filter.language" v-for="(update_filter, languageIndex) in update_filters">
              <form :data-vv-scope="'editFilterForm_'+languageIndex">
                <div class="vx-row">
                  <div class="vx-col sm:w-full mb-2">
                    <vs-input class="w-full" v-validate="'required'" label-placeholder="Name" :ref="'name_'+languageIndex" :name="'name_'+languageIndex" v-model="update_filter.name"/>
                    <span class="text-danger text-sm"  v-show="errors.has('editFilterForm_'+languageIndex+'.name_'+languageIndex)">This field is required</span>
                  </div>
                </div>

                <vs-divider position="left"> Filter options </vs-divider>

                <div class="flex flex-wrap items-center justify-end vx-row mb-2">
                  <div class="vx-col sm:w-full w-full flex flex-wrap items-center justify-end">
                    <vs-button @click="addEditFilterOptionFun(languageIndex)" class="ml-4" >Add Filter Option</vs-button>
                  </div>
                </div>

                <div class="vx-row mb-2" v-for="(optionData, optionIndex) in update_filter.options">
                  <div class="vx-col w-5/12 mb-2 pr-0">
                    <vs-input class="w-full" v-validate="'required'" placeholder="Filter Option" :name="'options_'+optionIndex" v-model="update_filter.options[optionIndex]"/>
                    <span class="text-danger text-sm"  v-show="errors.has('editFilterForm_'+languageIndex+'.options_'+optionIndex)">This field is required</span>
                  </div>
                  <div class="vx-col w-6/12 mb-2 px-0">
                    <vs-input class="w-full" v-validate="'required'"  placeholder="Filter Icon" :name="'icons_'+optionIndex" v-model="update_filter.icons[optionIndex]"/>
                    <span class="text-danger text-sm"  v-show="errors.has('editFilterForm_'+languageIndex+'.icons_'+optionIndex)">This field is required</span>
                  </div>
                  <div class="vx-col w-1/12 mb-2 pl-0">
                      <vs-button  @click="removeEditFilterOptionFun(languageIndex, optionIndex)"  class="" color="danger" type="filled" icon-pack="feather" icon="icon-x"></vs-button>
                  </div>
                </div>
                <a href="https://pictogrammers.github.io/@mdi/font/5.4.55" target="_blank">Material Design Icons</a>


       <!--          <div class="vx-row mt-4 mb-base">
                  <div class="vx-col sm:w-full mb-2">
                    <v-select v-model="update_filter.options" v-validate="'required'" :ref="'options_'+languageIndex" :name="'options_'+languageIndex" taggable placeholder="Add filter options"  multiple  :options="[]"></v-select>
                    <span class="text-danger text-sm"  v-show="errors.has('editFilterForm_'+languageIndex+'.options_'+languageIndex)">This field is required</span>
                  </div>
                </div> -->
<!-- 
                <div class="vx-row mb-2" >
                  <div class="vx-col sm:w-full mb-2">
                    <a href="https://pictogrammers.github.io/@mdi/font/5.4.55" target="_blank">Material Design Icons</a>
                    <v-select  v-model="update_filter.icons" v-validate="'required|length:'+update_filter.options.length" ref="icons" name="icons" taggable placeholder="Add filter icons"  multiple  :options="[]"></v-select>
                    <span class="text-danger text-sm"  v-show="errors.has('editFilterForm_'+languageIndex+'.icons')">{{ errors.first('editFilterForm_'+languageIndex+'.icons') }}</span>
                  </div>
                </div> -->

              </form>
            </vs-tab>
          </vs-tabs>

          <vs-divider />

          <div class="vx-row px-3">
            <div class="vx-col sm:w-full mb-2">
              <form data-vv-scope="updateFilterForm">
                <vs-input class="w-full" v-validate="'required|alpha'" label-placeholder="Name" ref="key" name="key" v-model="update_filter_key"/>
                <span class="text-danger text-sm" v-show="errors.has('updateFilterForm.key')">This field is invalid</span>
              </form>
            </div>
          </div>

          <div  class="vx-row mt-4">
            <div  class="vx-col w-1/2 mb-2">

            </div>
            <div  class="vx-col w-1/2 mb-2" align="right">
              <vs-button  v-on:click.prevent="validateEditCatForm()" color="primary" type="filled">Update Filter</vs-button>
            </div>
          </div>
        </div>
      </vs-popup>
    </div>
  </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import modulePlaceManagement from '@/store/place-management/modulePlaceManagement.js'

export default {
  components: {
    Treeselect,
  },
  data() {
    return {
      languages:[ 
        'en'
      ],
      selected:[],
      key : null, 
      active : null,
      search : null,
      totalPage: 1,
      currentPage: 1,
      companies : [],
      selected_companies : [],
      currentPage_ : 1,
      filters : [],
      roles : [],
      activePromptAddFilter : false,
      activePromptEditFilter : false,
      image : [],
      fileRecordsForUpload: [],
      create_filter_key : null,
      create_filters : [
        // {
        //   language : "en",
        //   name : null,
        //   image : null,
        //   readonly : true,
        // },
      ],
      update_filters_data : null,
      update_filter_key : null,
      update_filters : [
 
      ],

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
      activeTab : 0,
      activeEditTab : 0,
      deleteFilterData : null,
      appLanguages : [],
    }
  },
  watch: {
    currentPage(val) {
        this.searchFilter()
    }
  },
  computed: {

  },
  methods: {
    addFilterOptionFun(languageIndex) {
      this.create_filters[languageIndex].options.push("")
      this.create_filters[languageIndex].icons.push("")
    },
    removeFilterOptionFun(languageIndex, optionsIndex) {
      this.create_filters[languageIndex].options.splice(optionsIndex, 1);
      this.create_filters[languageIndex].icons.splice(optionsIndex, 1);
    },
    addEditFilterOptionFun(languageIndex) {
      this.update_filters[languageIndex].options.push("")
      this.update_filters[languageIndex].icons.push("")
    },
    removeEditFilterOptionFun(languageIndex, optionsIndex) {
      this.update_filters[languageIndex].options.splice(optionsIndex, 1);
      this.update_filters[languageIndex].icons.splice(optionsIndex, 1);
    },
    changeFilterOptions(languageIndex) {
      // console.log(this.create_filters)

    },
    confirmDeleteRecord(filter) {
      this.deleteFilterData = filter;
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm Delete`,
        text: `You are about to delete this filter ?`,
        accept: this.deleteRecord,
        acceptText: "Delete"
      })
    },
    deleteRecord() {
      this.$vs.loading();

      this.$store.dispatch("placeManagement/deleteFilter", { id : this.deleteFilterData.id})
          .then(res => { 
              this.$vs.loading.close()
              this.$vs.notify({
                  title: "Success.",
                  text: "Filter deleted successfully.",
                  iconPack: "feather",
                  icon: "icon-alert-circle",
                  color: "success"
              });
          })
          .catch(err => { 
            this.$vs.loading.close()
          })
    },
    showDeleteSuccess() {
      this.$vs.notify({
        color: 'success',
        title: 'User Deleted',
        text: 'The selected user was successfully deleted'
      })
    },
    checkPermissions(permissions) {
        let user = JSON.parse(localStorage.getItem("userInfo"))
        if(user && user.permissions_array){
          for (let i = 0; i < permissions.length; i++){
              if(user.permissions_array.includes(permissions[i])) return true
          }
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
            this.searchFilter()
        }, 2000);   
    },
    handleChangePage(page) {
        // this.searchFilter()
    },
    handleSort(key, active) {
        if(key){
            this.key = key
            this.active = active
            this.searchFilter()
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
      this.activeTab = 0
      this.create_filters[0].options = [""]
      this.create_filters[0].icons = [""]
      this.activePromptAddFilter = true
    },
    async validateAddCatForm() {
      this.activeTab = 0;
      var respomce = true
      for (let i = 0; i < this.create_filters.length; i++){
        await this.$validator.validateAll('addFilterForm_'+i).then(result => {
          if (!result){
            respomce = false;
          }
        })
      }

      await this.$validator.validateAll('addFilterForm').then(result => {
        if (!result){
          respomce = false;
        }
      })

      if(respomce) this.createCatApi()
    },
    createCatApi() {
      var self = this
      this.$vs.loading({
          container: '#createFilterLoadingDiv',
          scale: 0.6
      })

      console.log(this.create_filters)

      let data = new FormData();
      for (let i = 0; i < this.create_filters.length; i++){
        if(this.create_filters[i].name) data.append('name['+this.create_filters[i].language+']', this.create_filters[i].name);

        for (let j = 0; j < this.create_filters[i].options.length; j++){
          if(this.create_filters[i].options[j]) data.append('options['+j+']['+this.create_filters[i].language+']', this.create_filters[i].options[j]);
        }

        for (let j = 0; j < this.create_filters[i].icons.length; j++){
          if(this.create_filters[i].icons[j]) data.append('icons['+j+']', this.create_filters[i].icons[j]);
        }
      }

      data.append('key', this.create_filter_key);

      this.$store.dispatch("placeManagement/createFilter", data)
        .then(res => { 
            for (let i = 0; i < this.create_filters.length; i++){
              this.create_filters[i].name = null
              this.create_filters[i].options = [];
              this.create_filters[i].icons = [];
            }

            this.create_filter_key = null;
            this.$vs.loading.close('#createFilterLoadingDiv > .con-vs-loading')
            this.activePromptAddFilter = false
            this.$vs.notify({
                title: "Success.",
                text: "Filter created successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          this.$vs.loading.close('#createFilterLoadingDiv > .con-vs-loading')
          Object.keys(err.data.errors).forEach(function(key) {
            self.errors.add({
              field: key,
              scope: "addFilterForm",
              msg: err.data.errors[key][0],
            });
          });
        })
    },
    async editRecord(filter) {
      var self = this
      this.update_filters = [];
      this.activePromptEditFilter = true
      this.update_filters_data = filter
      this.update_filter_key = filter.key
      
      var appLanguages = this.$store.state.placeManagement.languages
      for (let i = 0; i < appLanguages.length; i++){
        let currentLangOpions = [];
        let currentLangIcons = [];

        if(filter.options.length){
          for (let j = 0; j < filter.options.length; j++){
            let currentOption = filter.options[j];
            if(currentOption.options[appLanguages[i].key]) currentLangOpions.push(currentOption.options[appLanguages[i].key])
            if(currentOption.icon) currentLangIcons.push(currentOption.icon)
          }
        }

        self.update_filters.push({
          language : appLanguages[i].key,
          name : filter.name[appLanguages[i].key] ? filter.name[appLanguages[i].key] : null,
          options : currentLangOpions,
          icons : currentLangIcons,
          readonly : appLanguages[i].key == "en" ? true : false,
        })
      }

      this.activeEditTab = 0
      this.$forceUpdate();
    },
    async validateEditCatForm() {
      var respomce = true
      for (let i = 0; i < this.create_filters.length; i++){
        await this.$validator.validateAll('editFilterForm_'+i).then(result => {
          if (!result){
            respomce = false;
          }
        })
      }

      await this.$validator.validateAll('updateFilterForm').then(result => {
        if (!result){
          respomce = false;
        }
      })

      if(respomce) this.updateCatApi()
    },
    updateCatApi() {
      var self = this
      this.$vs.loading({
          container: '#updateFilterLoadingDiv',
          scale: 0.6
      })

      let data = new FormData();
      for (let i = 0; i < this.update_filters.length; i++){
        if(this.update_filters[i].name) data.append('name['+this.update_filters[i].language+']', this.update_filters[i].name);

        for (let j = 0; j < this.update_filters[i].options.length; j++){
          if(this.update_filters[i].options[j]) data.append('options['+j+']['+this.update_filters[i].language+']', this.update_filters[i].options[j]);
        }

        for (let j = 0; j < this.update_filters[i].icons.length; j++){
          if(this.update_filters[i].icons[j]) data.append('icons['+j+']', this.update_filters[i].icons[j]);
        }
      }

      data.append('id', this.update_filters_data.id);
      data.append('key', this.update_filter_key);

      this.$store.dispatch("placeManagement/updateFilter", data)
        .then(res => { 
            this.update_filter_key = null;
            this.$vs.loading.close('#updateFilterLoadingDiv > .con-vs-loading')
            this.activePromptEditFilter = false
            this.$vs.notify({
                title: "Success.",
                text: "Filter updated successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          this.$vs.loading.close('#updateFilterLoadingDiv > .con-vs-loading')
          Object.keys(err.data.errors).forEach(function(key) {
            self.errors.add({
              field: key,
              scope: "updateFilterForm",
              msg: err.data.errors[key][0],
            });
          });
        })
    },
    async searchFilter() {
      var self = this
      this.$vs.loading({
          container: '#filterLoadingDiv',
          scale: 0.6
      })

      await this.$store.dispatch("placeManagement/viewFilter", { search : this.search, sort : this.key, sortKey : this.active, page : this.currentPage})
        .then(res => { 
          this.totalPage = res.data.last_page
          this.$vs.loading.close('#filterLoadingDiv > .con-vs-loading')
        })
        .catch(err => { 
          this.$vs.loading.close('#filterLoadingDiv > .con-vs-loading')
        })

        this.filters = this.$store.state.placeManagement.filters
    },
    async viewCategories() {
      var self = this

      await this.$store.dispatch("placeManagement/viewFilter", {page : this.currentPage})
        .then(res => { 
          this.totalPage = res.data.last_page
        })

      this.filters = this.$store.state.placeManagement.filters
    },
  },
  mounted() {
    var self = this
    this.filters = this.$store.state.placeManagement.filters
    this.roles = this.$store.state.placeManagement.roles

    this.$root.$on('clickEditRecord', (user) => {
      this.editRecord(user)
    });

    this.create_filters = [];
    var appLanguages = this.$store.state.placeManagement.languages
    // console.log(appLanguages)
    for (let i = 0; i < appLanguages.length; i++){
      self.create_filters.push({
        language : appLanguages[i].key,
        name : null,
        options : [],
        icons : [],
        readonly : appLanguages[i].name == "English" ? true : false,
      })
    }

    // console.log(this.create_filters)
  },
  async created() {
    var self = this
    // Register Module UserManagement Module
    if(!modulePlaceManagement.isRegistered) {
      this.$store.registerModule('placeManagement', modulePlaceManagement)
      modulePlaceManagement.isRegistered = true
    }

    await this.$store.dispatch("placeManagement/viewLanguage")
    this.create_filters = [];
    var appLanguages = this.$store.state.placeManagement.languages

    for (let i = 0; i < appLanguages.length; i++){
      self.create_filters.push({
        language : appLanguages[i].key,
        name : null,
        options : [],
        icons : [],
        readonly : appLanguages[i].name == "English" ? true : false,
      })
    }

    await this.viewCategories()
    // await this.$store.dispatch("placeManagement/viewRole")
    
    // this.roles = this.$store.state.placeManagement.roles
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
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

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