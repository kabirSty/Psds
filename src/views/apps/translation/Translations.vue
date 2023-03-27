<template>
  <div id="page-user-list">
    <div class="vx-card p-6">
      <div id="translationLoadingDiv" class="vs-con-loading__container">
      <vs-table
          :sst="true"
          @search="handleSearch"
          @change-page="handleChangePage"
          @sort="handleSort"
          v-model="selected"
          search
          :data="translations">

          <template slot="header">
             <div class="flex flex-wrap items-center w-full">
                <vs-button class="mb-4 md:mb-0 mr-2" type="filled" icon-pack="feather" icon="icon-download" @click="gridApi.exportDataAsCsv()"></vs-button>
                <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addUser()">Create Translation</vs-button>
            </div>
          </template>

          <template slot="thead">
              <vs-th sort-key="id">Id</vs-th>
              <vs-th style="width:80%;">Text</vs-th>
              <vs-th>Action</vs-th>
          </template>

          <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].id" >
                      <span class="ml13 sm:text-1em mb-4" v-html="data[indextr].id"></span>
                  </vs-td>
                  <vs-td :data="data[indextr].text" >
                      <span class="ml13 sm:text-1em mb-4" v-html="data[indextr].text.en"></span>
                  </vs-td>
        
                  <vs-td :data="data[indextr].text" >
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

      <vs-popup  classContent="popup-example h-full" title="Create Translation" :active.sync="activePromptAddTranslation">
        <div id="createTranslationLoadingDiv" class="vs-con-loading__container" style="min-height: 400px;" v-if="create_translation.length">
          <vs-tabs color="primary" v-model="activeTab">
            <vs-tab :label="create_cat.language" v-for="(create_cat, languageIndex) in create_translation">
              <form :data-vv-scope="'addTranslationForm_'+languageIndex">
<!--                 <div class="vx-row mt-2">
                  <div class="vx-col sm:w-full mb-2">
                    <vx-input-group class="mb-base">
                      <vs-input class="w-full" :readonly="create_cat.readonly" v-validate="'required'" label-placeholder="" :ref="'language_'+languageIndex" :name="'language_'+languageIndex" v-model="create_cat.language"/>
                      <span class="text-danger text-sm"  v-show="errors.has('addTranslationForm_'+languageIndex+'.language_'+languageIndex)">This field is required</span> 
                      <template slot="append">
                        <div class="append-text btn-addon">
                          <vs-button @click="removeLanguage(languageIndex, create_cat.language)" :disabled="create_cat.readonly" color="danger" type="gradient" icon-pack="feather" icon="icon-x"></vs-button>
                        </div>
                      </template>
                    </vx-input-group>
                  </div>
                </div>
 -->
                <div class="vx-row">
                  <div class="vx-col sm:w-full mb-2">
                    <vs-textarea :ref="'text_'+languageIndex" :name="'text_'+languageIndex" v-model="create_cat.text" v-validate="'required'" label="Text" height="400" />
                    <span class="text-danger text-sm"  v-show="errors.has('addTranslationForm_'+languageIndex+'.text_'+languageIndex)">This field is required</span>
                  </div>
                </div>

              </form>
            </vs-tab>
          </vs-tabs>

          <div  class="vx-row mt-4">
            <div  class="vx-col w-1/2 mb-2">
              <!-- <vs-button  v-on:click.prevent="addLanguage()" color="primary" type="filled">Add a Language</vs-button> -->
            </div>
            <div  class="vx-col w-1/2 mb-2" align="right">
              <vs-button  align="right" v-on:click.prevent="validateAddTranslationForm()" color="primary" type="filled">Create Translation</vs-button>
            </div>
          </div>
        </div>
      </vs-popup>

      <vs-popup  classContent="popup-example h-full" title="Update Translation" :active.sync="activePromptEditTranslation">
        <div id="updateTranslationLoadingDiv" class="vs-con-loading__container" style="min-height: 400px;">
          <vs-tabs v-if="update_translation.length" v-model="activeEditTab">
            <vs-tab v-for="(update_trans, languageIndex) in update_translation" :key="languageIndex" :label="update_trans.language">
              <form :data-vv-scope="'editTranslationForm_'+languageIndex">
    <!--             <div class="vx-row mt-2">
                  <div class="vx-col sm:w-full mb-2">
                    <vx-input-group class="mb-base">
                      <vs-input class="w-full" :readonly="update_trans.readonly" v-validate="'required'" label-placeholder="" :ref="'language_'+languageIndex" :name="'language_'+languageIndex" v-model="update_trans.language"/>
                    <span class="text-danger text-sm"  v-show="errors.has('editTranslationForm_'+languageIndex+'.language_'+languageIndex)">This field is required</span>

                      <template slot="append">
                        <div class="append-text btn-addon">
                          <vs-button @click="removeEditLanguage(languageIndex, update_translation.language)" :disabled="update_translation.readonly" color="danger" type="gradient" icon-pack="feather" icon="icon-x"></vs-button>
                        </div>
                      </template>
                    </vx-input-group>
                  </div>
                </div> -->

                <div class="vx-row mt-4">
                  <div class="vx-col sm:w-full mb-2">
                    <vs-textarea :ref="'text_'+languageIndex" :name="'text_'+languageIndex" v-model="update_trans.text" v-validate="'required'" label="Text" height="500" />
                    <span class="text-danger text-sm"  v-show="errors.has('editTranslationForm_'+languageIndex+'.text_'+languageIndex)">This field is required</span>
                    <!-- <span class="text-danger text-sm"  v-show="errors.has('editTranslationForm_'+languageIndex+'.name_'+languageIndex)">{{ errors.first('editTranslationForm_'+languageIndex+'.name_'+languageIndex) }}</span> -->
                  </div>
                </div>
              </form>
            </vs-tab>
          </vs-tabs>

          <div  class="vx-row mt-4">
            <div  class="vx-col w-1/2 mb-2">
              <!-- <vs-button  v-on:click.prevent="addEditLanguage()" color="primary" type="filled">Add a Language</vs-button> -->
            </div>
            <div  class="vx-col w-1/2 mb-2" align="right">
              <vs-button  align="right" v-on:click.prevent="validateEditTranslationForm()" color="primary" type="filled">Update Translation</vs-button>
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
import modulePlaceManagement from '@/store/place-management/modulePlaceManagement.js'

export default {
  components: {

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
      translations : [],
      roles : [],
      activePromptAddTranslation : false,
      activePromptEditTranslation : false,
      image : [],
      fileRecordsForUpload: [],
      create_translation : [
        // {
        //   language : "en",
        //   text : null,
        //   readonly : true,
        // },
      ],
      create_translation_deleted : [],
      update_translation : [
 
      ],
      update_translation_data : null,
      edit_cat : {
        name : null,
        image : null,
      },
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
      deleteTranslationData : null,
    }
  },
  watch: {
    currentPage(val) {
        this.searchTranslations()
    }
  },
  computed: {

  },
  methods: {
    removeLanguage(languageIndex, lang) {
      this.activeTab = 0;
      // this.activeTab = this.activeTab -1;
      // this.create_translation.splice(languageIndex, 1)
      // this.create_translation_deleted.push(lang)

      this.create_translation[languageIndex].text = null;

      var lis = document.querySelectorAll('#createTranslationLoadingDiv ul li');
      if(lis){
        // lis[languageIndex].remove();
        lis[languageIndex].style.display = "none";
      }
    },
    removeEditLanguage(languageIndex, lang) {
      // this.activeEditTab = this.activeEditTab -1;
      this.activeEditTab = 0;
      this.update_translation[languageIndex].text = null;
      // this.update_translation.splice(languageIndex, 1)
      // this.create_translation_deleted.push(lang)
      

      var lis = document.querySelectorAll('#updateTranslationLoadingDiv ul li');
      if(lis){
        for (let i = 0; i < lis.length; i++){
          if(lis[i].classList.contains("activeChild")){
            // lis[i].remove();
            lis[i].style.display = "none";
          }
        }

        // lis[languageIndex].remove();
      }
    },
    addLanguage() {
      let languagesCount = this.create_translation.length;
      languagesCount ++;
      console.log(this.create_translation)
      this.create_translation.push({
        language : 'language '+languagesCount,
        text : null,
        readonly : false,
      })
    },
    addEditLanguage() {
      let languagesCount = this.update_translation.length;
      languagesCount ++;
      this.update_translation.push({
        language : 'language '+languagesCount,
        text : null,
        readonly : false,
      })
    },
    confirmDeleteRecord(translation) {
      this.deleteTranslationData = translation;
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm Delete`,
        text: `You are about to delete this translation ?`,
        accept: this.deleteRecord,
        acceptText: "Delete"
      })
    },
    deleteRecord() {
      this.$vs.loading();

      this.$store.dispatch("placeManagement/deleteTranslation", { id : this.deleteTranslationData.id})
          .then(res => { 
              this.$vs.loading.close()
              this.$vs.notify({
                  title: "Success.",
                  text: "Translation deleted successfully.",
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
            this.searchUser()
        }, 2000);   
    },
    handleChangePage(page) {
        // this.searchUser()
    },
    handleSort(key, active) {
        if(key){
            this.key = key
            this.active = active
            this.searchUser()
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
      this.activeTab = 0;
      this.activePromptAddTranslation = true
    },
    async validateAddTranslationForm() {
      var respomce = true
      for (let i = 0; i < this.create_translation.length; i++){
        await this.$validator.validateAll('addTranslationForm_'+i).then(result => {
          if (!result){
            respomce = false;
          }
        })
      }

      // console.log(respomce)
      if(respomce) this.createTranslationApi()
    },
    createTranslationApi() {
      var self = this
      this.$vs.loading({
          container: '#createTranslationLoadingDiv',
          scale: 0.6
      })

      let data = new FormData();
      for (let i = 0; i < this.create_translation.length; i++){
        if(this.create_translation[i].text) data.append('text['+this.create_translation[i].language+']', this.create_translation[i].text);
      }

      this.$store.dispatch("placeManagement/createTranslation", data)
        .then(res => { 
            this.$vs.loading.close('#createTranslationLoadingDiv > .con-vs-loading')
            this.activePromptAddTranslation = false
            this.$vs.notify({
                title: "Success.",
                text: "Translation created successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          this.$vs.loading.close('#createTranslationLoadingDiv > .con-vs-loading')
          Object.keys(err.data.errors).forEach(function(key) {
            self.errors.add({
              field: key,
              scope: "addUserForm",
              msg: err.data.errors[key][0],
            });
          });
        })
    },
    async editRecord(translation) {
      var lis = document.querySelectorAll('#updateTranslationLoadingDiv ul');
      // if(lis){
      //   // lis.innerHTML = "";
      //   for (let i = 0; i < lis.length; i++){
      //     lis[i].style.display = "none";
      //     // lis[i].remove();
      //   }
      // }
      var self = this
      this.update_translation = [];
      this.activePromptEditTranslation = true
      this.update_translation_data = translation;
      
      var appLanguages = this.$store.state.placeManagement.languages
      for (let i = 0; i < appLanguages.length; i++){
        self.update_translation.push({
          language : appLanguages[i].key,
          text : translation.text[appLanguages[i].key] ? translation.text[appLanguages[i].key] : null,
          readonly : appLanguages[i].key == "en" ? true : false,
        })
      }

      this.activeEditTab = 0

      // this.$vs.loading({
      //     container: '#updateTranslationLoadingDiv',
      //     scale: 0.6
      // })

      // this.update_translation = [];
      // this.activePromptEditTranslation = true
      
      // var self = this
      // this.update_translation_data = translation;

      // await setTimeout(function(){
      //   for (var key in translation.text) {
      //     self.update_translation.push({
      //       language : key,
      //       text : translation.text[key],
      //       readonly : key == "en" ? true : false,
      //     })
      //   }
      //   self.activeEditTab = 0
      //   self.$vs.loading.close('#updateTranslationLoadingDiv > .con-vs-loading')
      // }, 1000)

      this.$forceUpdate();
    },
    async validateEditTranslationForm() {
      var respomce = true
      for (let i = 0; i < this.update_translation.length; i++){
        await this.$validator.validateAll('editTranslationForm_'+i).then(result => {
          if (!result){
            respomce = false;
          }
        })
      }

      if(respomce) this.updateTranslationApi()
    },
    updateTranslationApi() {
      var self = this
      this.$vs.loading({
          container: '#updateTranslationLoadingDiv',
          scale: 0.6
      })

      let data = new FormData();
      for (let i = 0; i < this.update_translation.length; i++){
        if(this.update_translation[i].text && this.update_translation[i].text != "null") data.append('text['+this.update_translation[i].language+']', this.update_translation[i].text);
      }

      data.append('id', this.update_translation_data.id);

      this.$store.dispatch("placeManagement/updateTranslation", data)
        .then(res => { 
            this.$vs.loading.close('#updateTranslationLoadingDiv > .con-vs-loading')
            this.activePromptEditTranslation = false
            this.$vs.notify({
              title: "Success.",
              text: "Translation updated successfully.",
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "success"
            });

            this.$forceUpdate();
            // vm.$forceUpdate();
        })
        .catch(err => { 
          this.$vs.loading.close('#updateTranslationLoadingDiv > .con-vs-loading')
          Object.keys(err.data.errors).forEach(function(key) {
            self.errors.add({
              field: key,
              scope: "addUserForm",
              msg: err.data.errors[key][0],
            });
          });
        })
    },
    async searchTranslations() {
      var self = this
      this.$vs.loading({
          container: '#translationLoadingDiv',
          scale: 0.6
      })

      await this.$store.dispatch("placeManagement/viewTranslation", { search : this.search, sort : this.key, sort_key : this.active, page : this.currentPage})
        .then(res => { 
          this.totalPage = res.data.last_page
          this.$vs.loading.close('#translationLoadingDiv > .con-vs-loading')
        })
        .catch(err => { 
          this.$vs.loading.close('#translationLoadingDiv > .con-vs-loading')
        })

        this.translations = this.$store.state.placeManagement.translations
    },
    async viewTranslations() {
      var self = this

      await this.$store.dispatch("placeManagement/viewTranslation", {page : this.currentPage})
        .then(res => { 
          this.totalPage = res.data.last_page
        })

      this.translations = this.$store.state.placeManagement.translations
    },
  },
  mounted() {
    var self = this
    this.translations = this.$store.state.placeManagement.translations
    this.roles = this.$store.state.placeManagement.roles

    this.$root.$on('clickEditRecord', (user) => {
      this.editRecord(user)
    });

    this.create_translation = [];
    var appLanguages = this.$store.state.placeManagement.languages
    for (let i = 0; i < appLanguages.length; i++){
      self.create_translation.push({
        language : appLanguages[i].key,
        text : null,
        readonly : appLanguages[i].name == "English" ? true : false,
      })
    }
  },
  async created() {
    var self = this
    // Register Module UserManagement Module
    if(!modulePlaceManagement.isRegistered) {
      this.$store.registerModule('placeManagement', modulePlaceManagement)
      modulePlaceManagement.isRegistered = true
    }

    await this.$store.dispatch("placeManagement/viewLanguage")
    this.create_translation = [];
    var appLanguages = this.$store.state.placeManagement.languages

    for (let i = 0; i < appLanguages.length; i++){
      self.create_translation.push({
        language : appLanguages[i].key,
        text : null,
        readonly : appLanguages[i].name == "English" ? true : false,
      })
    }

    await this.viewTranslations()
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

.vs-textarea{
  height: 200px;
}
</style>