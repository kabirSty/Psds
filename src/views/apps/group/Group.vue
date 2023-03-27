<template>
  <div id="page-user-list">
    <div class="vx-card p-6">
      <div id="groupLoadingDiv" class="vs-con-loading__container">
      <vs-table
          :sst="true"
          @search="handleSearch"
          @change-page="handleChangePage"
          @sort="handleSort"
          v-model="selected"
          search
          :data="groups">

          <template slot="header">
             <div class="flex flex-wrap items-center w-full">
                <vs-button class="mb-4 md:mb-0 mr-2" type="filled" icon-pack="feather" icon="icon-download" @click="gridApi.exportDataAsCsv()"></vs-button>
                <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addUser()">Add Group</vs-button>
            </div>
          </template>

          <template slot="thead">
              <vs-th sort-key="name">Name</vs-th>
              <vs-th>Image</vs-th>
              <vs-th>Color</vs-th>
              <vs-th>Description</vs-th>
              <vs-th>Action</vs-th>
          </template>

          <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].name" >
                      <span class="ml13 sm:text-1em mb-4" v-html="data[indextr].name.en"></span>
                  </vs-td>
                  <vs-td :data="data[indextr].image">
                      <img width="50" :src="data[indextr].image_path">
                  </vs-td>
                  <vs-td :data="data[indextr].color">
                    <div v-if="data[indextr].color">
                      <vs-chip class="ag-grid-cell-chip" :color="data[indextr].color"></vs-chip>
                    </div>
                    <div v-else>
                      <vs-chip class="ag-grid-cell-chip" color="primary"></vs-chip>
                    </div>
                  </vs-td>
                  <vs-td :data="data[indextr].description" style="max-width: 250px;">
                      <span class="ml13 sm:text-1em mb-4" v-html="data[indextr].description && data[indextr].description.en ? data[indextr].description.en : ''"></span>
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

      <vs-popup  classContent="popup-example h-full" title="Create Group" :active.sync="activePromptAddGroup">
        <div id="createGroupLoadingDiv" class="vs-con-loading__container" v-if="create_groups.length">
          <vs-tabs color="primary" v-model="activeTab">
            <vs-tab active :label="create_cat.language" v-for="(create_cat, languageIndex) in create_groups">
              <form :data-vv-scope="'addGroupForm_'+languageIndex">
<!--                 <div class="vx-row mt-2">
                  <div class="vx-col sm:w-full mb-2">
                    <vx-input-group class="">
                      <vs-input class="w-full" :readonly="create_cat.readonly" v-validate="'required'" label-placeholder="" :ref="'language_'+languageIndex" :name="'language_'+languageIndex" v-model="create_cat.language"/>
                      <span class="text-danger text-sm"  v-show="errors.has('addGroupForm_'+languageIndex+'.language_'+languageIndex)">This field is required</span>
                      <template slot="append">
                        <div class="append-text btn-addon">
                          <vs-button @click="removeLanguage(languageIndex, create_cat.language)" :disabled="create_cat.readonly" color="danger" type="gradient" icon-pack="feather" icon="icon-x"></vs-button>
                        </div>
                      </template>
                    </vx-input-group>
                  </div>
                </div> -->

                <div class="vx-row">
                  <div class="vx-col sm:w-3/4 mb-2">
                    <vs-input class="w-full" v-validate="'required'" label-placeholder="Name" :ref="'name_'+languageIndex" :name="'name_'+languageIndex" v-model="create_cat.name"/>
                    <span class="text-danger text-sm"  v-show="errors.has('addGroupForm_'+languageIndex+'.name_'+languageIndex)">This field is required</span>
                    <!-- <span class="text-danger text-sm"  v-show="errors.has('addGroupForm_'+languageIndex+'.name_'+languageIndex)">{{ errors.first('addGroupForm_'+languageIndex+'.name_'+languageIndex) }}</span> -->
                  </div>
                  <div class="vx-col sm:w-1/4 mb-2">
                    <label>Color</label><br>
                    <input style="width: 100px;" class="absolute cursor-pointer" type="color" v-model="add_color">
                  </div>
                </div>

                <div class="vx-row">
                  <div class="vx-col sm:w-full mb-2">
                    <vs-textarea v-model="create_cat.description" label="Description" height="200" />
                  </div>
                </div>
              </form>
            </vs-tab>
          </vs-tabs>

          <div class="vx-row px-3">
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
                :helpText="'Choose image'"
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

          <div  class="vx-row mt-4">
            <div  class="vx-col w-1/2 mb-2">
              <!-- <vs-button  v-on:click.prevent="addLanguage()" color="primary" type="filled">Add Language</vs-button> -->
            </div>
            <div  class="vx-col w-1/2 mb-2" align="right">
              <vs-button  v-on:click.prevent="validateAddCatForm()" color="primary" type="filled">Create Group</vs-button>
            </div>
          </div>

          <div align="right" class="vx-row mt-4">
            <div  class="vx-col w-full mb-2">
              
            </div>
          </div>
        </div>
      </vs-popup>

      <vs-popup  classContent="popup-example h-full" title="Update Group" :active.sync="activePromptEditGroup">
        <div id="updateGroupLoadingDiv" class="vs-con-loading__container">
          <vs-tabs color="primary" v-if="update_groups.length" v-model="activeEditTab">
            <vs-tab active :label="update_cat.language" v-for="(update_cat, languageIndex) in update_groups">
              <form :data-vv-scope="'editGroupForm_'+languageIndex">
    <!--             <div class="vx-row mt-2">
                  <div class="vx-col sm:w-full mb-2">
                    <vx-input-group class="mb-base">
                      <vs-input class="w-full" :readonly="update_cat.readonly" v-validate="'required'" label-placeholder="" :ref="'language_'+languageIndex" :name="'language_'+languageIndex" v-model="update_cat.language"/>
                      <span class="text-danger text-sm"  v-show="errors.has('editGroupForm_'+languageIndex+'.language_'+languageIndex)">This field is required</span>
                      <template slot="append">
                        <div class="append-text btn-addon">
                          <vs-button @click="removeEditLanguage(languageIndex, update_cat.language)" :disabled="update_cat.readonly" color="danger" type="gradient" icon-pack="feather" icon="icon-x"></vs-button>
                        </div>
                      </template>
                    </vx-input-group>
                  </div>
                </div> -->

                <div class="vx-row">
                  <div class="vx-col sm:w-3/4 mb-2">
                    <vs-input class="w-full" v-validate="'required'" label-placeholder="Name" :ref="'name_'+languageIndex" :name="'name_'+languageIndex" v-model="update_cat.name"/>
                    <span class="text-danger text-sm"  v-show="errors.has('editGroupForm_'+languageIndex+'.name_'+languageIndex)">This field is required</span>
              <!--       <span class="text-danger text-sm"  v-show="errors.has('editGroupForm_'+languageIndex+'.name_'+languageIndex)">{{ errors.first('editGroupForm_'+languageIndex+'.name_'+languageIndex) }}</span> -->
                  </div>
                  <div class="vx-col sm:w-1/4 mb-2">
                    <label>Color</label><br>
                    <input style="width: 100px;" class="absolute cursor-pointer" type="color" v-model="edit_color">
                  </div>
                </div>

                <div class="vx-row">
                  <div class="vx-col sm:w-full mb-2">
                    <vs-textarea v-model="update_cat.description" label="Description" height="200" />
                  </div>
                </div>

              </form>
            </vs-tab>
          </vs-tabs>

          <div class="vx-row px-3">
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
                :helpText="'Choose image'"
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

          <div  class="vx-row mt-4">
            <div  class="vx-col w-1/2 mb-2">
              <!-- <vs-button  v-on:click.prevent="addEditLanguage()" color="primary" type="filled">Add Language</vs-button> -->
            </div>
            <div  class="vx-col w-1/2 mb-2" align="right">
              <vs-button  v-on:click.prevent="validateEditCatForm()" color="primary" type="filled">Update Group</vs-button>
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
      groups : [],
      roles : [],
      activePromptAddGroup : false,
      activePromptEditGroup : false,
      image : [],
      add_color : "#FF9300",
      edit_color : null,
      fileRecordsForUpload: [],
      create_groups : [
        // {
        //   language : "en",
        //   name : null,
        //   image : null,
        //   readonly : true,
        // },
      ],
      update_groups_data : null,
      update_groups : [
 
      ],
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
      deleteGroupData : null,
      appLanguages : [],
    }
  },
  watch: {
      currentPage(val) {
          this.searchGroup()
      }
  },
  computed: {

  },
  methods: {
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
    removeLanguage(languageIndex, lang) {
      this.activeTab = 0;
      this.create_groups[languageIndex].name = null;

      var lis = document.querySelectorAll('#createGroupLoadingDiv ul li');
      if(lis){
        // lis[languageIndex].remove();
        lis[languageIndex].style.display = "none";
      }
    },
    removeEditLanguage(languageIndex, lang) {
      this.activeEditTab = 0;
      this.update_groups[languageIndex].name = null;
      
      var lis = document.querySelectorAll('#updateGroupLoadingDiv ul li');
      if(lis){
        for (let i = 0; i < lis.length; i++){
          if(lis[i].classList.contains("activeChild")){
            // lis[i].remove();
            lis[i].style.display = "none";
          }
        }
      }
    },
    addLanguage() {
      let languagesCount = this.create_groups.length;
      languagesCount ++;
      this.create_groups.push({
        language : 'language '+languagesCount,
        name : null,
        image : null,
        color : null,
        description : null,
        readonly : false,
      })
    },
    addEditLanguage() {
      let languagesCount = this.update_groups.length;
      languagesCount ++;
      this.update_groups.push({
        language : 'language '+languagesCount,
        name : null,
        image : null,
        color : null,
        readonly : false,
      })
    },
    confirmDeleteRecord(group) {
      this.deleteGroupData = group;
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm Delete`,
        text: `You are about to delete this group ?`,
        accept: this.deleteRecord,
        acceptText: "Delete"
      })
    },
    deleteRecord() {
      this.$vs.loading();

      this.$store.dispatch("placeManagement/deleteGroup", { id : this.deleteGroupData.id})
          .then(res => { 
              this.$vs.loading.close()
              this.$vs.notify({
                  title: "Success.",
                  text: "Group deleted successfully.",
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
            this.searchGroup()
        }, 2000);   
    },
    handleChangePage(page) {
        // this.searchGroup()
    },
    handleSort(key, active) {
        if(key){
            this.key = key
            this.active = active
            this.searchGroup()
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
      this.activePromptAddGroup = true
    },
    async validateAddCatForm() {
      var respomce = true
      for (let i = 0; i < this.create_groups.length; i++){
        await this.$validator.validateAll('addGroupForm_'+i).then(result => {
          if (!result){
            respomce = false;
          }
        })
      }

      if(respomce) this.createCatApi()
    },
    createCatApi() {
      var self = this
      this.$vs.loading({
          container: '#createGroupLoadingDiv',
          scale: 0.6
      })

      let data = new FormData();
      for (let i = 0; i < this.create_groups.length; i++){
        if(this.create_groups[i].name) data.append('name['+this.create_groups[i].language+']', this.create_groups[i].name);
        if(this.create_groups[i].description) data.append('description['+this.create_groups[i].language+']', this.create_groups[i].description);
      }

      if(this.add_color) data.append('color', this.add_color);
      if(this.image.length) data.append('image', this.image[0].file);

      this.$store.dispatch("placeManagement/createGroup", data)
        .then(res => { 
            this.image = [];
            this.$vs.loading.close('#createGroupLoadingDiv > .con-vs-loading')
            this.activePromptAddGroup = false
            this.$vs.notify({
                title: "Success.",
                text: "Group created successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          this.$vs.loading.close('#createGroupLoadingDiv > .con-vs-loading')
          Object.keys(err.data.errors).forEach(function(key) {
            self.errors.add({
              field: key,
              scope: "addUserForm",
              msg: err.data.errors[key][0],
            });
          });
        })
    },
    async editRecord(group) {
      // this.$vs.loading({
      //     container: '#updateGroupLoadingDiv',
      //     scale: 0.6
      // })

      var self = this
      this.update_groups = [];
      this.activePromptEditGroup = true
      this.update_groups_data = group
      this.edit_color = group.color
      
      var appLanguages = this.$store.state.placeManagement.languages
      for (let i = 0; i < appLanguages.length; i++){
        self.update_groups.push({
          language : appLanguages[i].key,
          color : group.color,
          name : group.name[appLanguages[i].key] ? group.name[appLanguages[i].key] : null,
          description : group.description && group.description[appLanguages[i].key] ? group.description[appLanguages[i].key] : null,
          readonly : appLanguages[i].key == "en" ? true : false,
        })
      }


      // await setTimeout(function(){
      //   for (var key in group.name) {
      //     self.update_groups.push({
      //       language : key,
      //       name : group.name[key],
      //       readonly : key == "en" ? true : false,
      //     })
      //   }
      //   self.activeEditTab = 0
      //   self.$vs.loading.close('#updateGroupLoadingDiv > .con-vs-loading')
      // }, 1000)

      this.activeEditTab = 0
      // this.$vs.loading.close('#updateGroupLoadingDiv > .con-vs-loading')

      this.$forceUpdate();

      // var self = this
      // this.update_groups = [];
      // this.update_groups_data = group;

      // for (var key in group.name) {
      //   self.update_groups.push({
      //     language : key,
      //     name : group.name[key],
      //     readonly : false,
      //   })
      // }

      // this.activePromptEditGroup = true
    },
    async validateEditCatForm() {
      var respomce = true
      for (let i = 0; i < this.create_groups.length; i++){
        await this.$validator.validateAll('editGroupForm_'+i).then(result => {
          if (!result){
            respomce = false;
          }
        })
      }

      if(respomce) this.updateCatApi()
    },
    updateCatApi() {
      var self = this
      this.$vs.loading({
          container: '#updateGroupLoadingDiv',
          scale: 0.6
      })

      let data = new FormData();
      for (let i = 0; i < this.update_groups.length; i++){
        if(this.update_groups[i].name) data.append('name['+this.update_groups[i].language+']', this.update_groups[i].name);
        if(this.update_groups[i].description) data.append('description['+this.update_groups[i].language+']', this.update_groups[i].description);
      }

      data.append('id', this.update_groups_data.id);
      if(this.edit_color) data.append('color', this.edit_color);
      if(this.image.length) data.append('image', this.image[0].file);

      this.$store.dispatch("placeManagement/updateGroup", data)
        .then(res => { 
            this.image = [];
            this.$vs.loading.close('#updateGroupLoadingDiv > .con-vs-loading')
            this.activePromptEditGroup = false
            this.$vs.notify({
                title: "Success.",
                text: "Group updated successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success"
            });
        })
        .catch(err => { 
          this.$vs.loading.close('#updateGroupLoadingDiv > .con-vs-loading')
          Object.keys(err.data.errors).forEach(function(key) {
            self.errors.add({
              field: key,
              scope: "addUserForm",
              msg: err.data.errors[key][0],
            });
          });
        })
    },
    async searchGroup() {
      var self = this
      this.$vs.loading({
          container: '#groupLoadingDiv',
          scale: 0.6
      })

      await this.$store.dispatch("placeManagement/viewGroup", { search : this.search, sort : this.key, sortKey : this.active, page : this.currentPage})
        .then(res => { 
          this.totalPage = res.data.last_page
          this.$vs.loading.close('#groupLoadingDiv > .con-vs-loading')
        })
        .catch(err => { 
          this.$vs.loading.close('#groupLoadingDiv > .con-vs-loading')
        })

        this.groups = this.$store.state.placeManagement.groups
    },
    async viewGroups() {
      var self = this

      await this.$store.dispatch("placeManagement/viewGroup", {page : this.currentPage})
        .then(res => { 
          this.totalPage = res.data.last_page
        })

      this.groups = this.$store.state.placeManagement.groups
    },
  },
  mounted() {
    var self = this
    this.groups = this.$store.state.placeManagement.groups
    this.roles = this.$store.state.placeManagement.roles

    this.$root.$on('clickEditRecord', (user) => {
      this.editRecord(user)
    });

    this.create_groups = [];
    var appLanguages = this.$store.state.placeManagement.languages
    // console.log(appLanguages)
    for (let i = 0; i < appLanguages.length; i++){
      self.create_groups.push({
        language : appLanguages[i].key,
        name : null,
        description : null,
        color : null,
        readonly : appLanguages[i].name == "English" ? true : false,
      })
    }

    // console.log(this.create_groups)
  },
  async created() {
    var self = this
    // Register Module UserManagement Module
    if(!modulePlaceManagement.isRegistered) {
      this.$store.registerModule('placeManagement', modulePlaceManagement)
      modulePlaceManagement.isRegistered = true
    }

    await this.$store.dispatch("placeManagement/viewLanguage")
    this.create_groups = [];
    var appLanguages = this.$store.state.placeManagement.languages

    for (let i = 0; i < appLanguages.length; i++){
      self.create_groups.push({
        language : appLanguages[i].key,
        name : null,
        description : null,
        color : null,
        readonly : appLanguages[i].name == "English" ? true : false,
      })
    }

    await this.viewGroups()
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