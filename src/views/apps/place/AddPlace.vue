<template>
    <vx-card title="Add a Place">
        <div id="createPlaceLoadingDiv" class="vs-con-loading__container">
            <div class="vx-row mb-2">
                <div class="vx-col w-full mb-2">
                    <ul class="demo-alignment">
                        <li v-for="(type_option, typeIndex) in type_options">
                            <vs-radio v-model="type" :vs-value="type_option.value">{{ type_option.text }}</vs-radio>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="vx-row mb-2 placesTab">
                <div class="vx-col w-full mb-2" v-if="create_places.length">
                    <vs-tabs color="primary" v-model="activeTab">
                        <vs-tab :label="create_place.language" v-for="(create_place, languageIndex) in create_places">
                          <form :data-vv-scope="'addPlaceForm_'+languageIndex">
          <!--                   <div class="vx-row mt-2">
                              <div class="vx-col sm:w-full mb-2">
                                <vx-input-group class="mb-2">
                                  <vs-input class="w-full" :readonly="create_place.readonly" v-validate="'required'" label-placeholder="" :ref="'language_'+languageIndex" :name="'language_'+languageIndex" v-model="create_place.language"/>
                                  <span class="text-danger text-sm"  v-show="errors.has('addPlaceForm_'+languageIndex+'.language_'+languageIndex)">This field is required</span> 

                                  <template slot="append">
                                    <div class="append-text btn-addon">
                                      <vs-button @click="removeLanguage(languageIndex, create_place.language)" :disabled="create_place.readonly" color="danger" type="gradient" icon-pack="feather" icon="icon-x"></vs-button>
                                    </div>
                                  </template>
                                </vx-input-group>
                              </div>
                            </div> -->

                            <div class="vx-row">
                              <div class="vx-col sm:w-full mb-4">
                                <vs-input class="w-full" label="Place name" :ref="'text_'+languageIndex" :name="'text_'+languageIndex" v-model="create_place.name" v-validate="'required'" />
                                <span class="text-danger text-sm"  v-show="errors.has('addPlaceForm_'+languageIndex+'.text_'+languageIndex)">This field is required</span>
                              </div>
                            </div>

                            <div class="vx-row">
                              <div class="vx-col sm:w-full">
                                <vs-textarea v-model="create_place.description" label="Place description" height="200" />
                              </div>
                            </div>

<!--                             <div  class="vx-row">
                                <div  class="vx-col w-1/2 mb-2">
                                  <vs-button  v-on:click.prevent="addLanguage()" color="primary" type="filled">Add a Language</vs-button>
                                </div>
                                <div  class="vx-col w-1/2 mb-2" align="right">
                                  
                                </div>
                            </div> -->

                            <vs-divider position="left"> Additional fields </vs-divider>

                            <div class="flex flex-wrap items-center justify-end vx-row mb-base">
                              <div class="vx-col sm:w-full w-full flex flex-wrap items-center justify-end">
                                <vs-button @click="addNewField(languageIndex)" class="ml-4" >Add field</vs-button>
                              </div>
                            </div>

                            <div v-if="create_place.additional_details">
                                <div class="vx-row mt-2" v-for="(additionalDetail, index) in create_place.additional_details" :key="index" >
                                    <div class="vx-col w-3/12 mb-2 pr-0">
                                        <treeselect openDirection="top" @input="changeKey(languageIndex, index)" class="w-full" v-model="additionalDetail.key" :multiple="false" :options="place_filters_options(create_place.language)" v-validate="'required'" :name="'additional_detail_key_'+index" :ref="'additional_detail_key_'+index"/>
                                        <span class="text-danger text-sm" v-show="errors.has('addPlaceForm_'+languageIndex+'.additional_detail_key_'+index)">This key field is required</span>
                                    </div>
                                    <div class="vx-col w-8/12 mb-2 px-0">
                                        <treeselect openDirection="top" @input="changeKeyValue(languageIndex, index)" class="w-full" v-model="additionalDetail.value" :multiple="true" :options="place_filters_options_values(create_place.language, languageIndex, index)" v-validate="'required'" :name="'additional_detail_value_'+index" :ref="'additional_detail_value_'+index"/>
                               <!--          <vs-input class="w-full" v-validate="'required|max:500'" placeholder="value" :name="'additional_detail_value_'+index" :ref="'additional_detail_value_'+index" v-model="additionalDetail.value" /> -->
                                        <span class="text-danger text-sm" v-show="errors.has('addPlaceForm_'+languageIndex+'.additional_detail_value_'+index)">This value field is required</span>
                                    </div>
                                    <div class="vx-col w-1/12 mb-2 pl-0">
                                        <vs-button @click="removeField(languageIndex, index)" class="" color="danger" type="filled" icon-pack="feather" icon="icon-x"></vs-button>
                                    </div>
                                </div>

              <!--                   <div class="vx-row mt-2" v-for="(additionalDetail, index) in create_place.additional_details" :key="index" >
                                    <div class="vx-col sm:w-full w-full mb-2">
                                      <vx-input-group class="mb-2">
                                        <template slot="prepend">
                                          <div class="prepend-text pl-0" style="background-color: #e7e7e7;">
                                            <treeselect style="width:200px;" v-model="additionalDetail.key" :multiple="false" :options="place_filters_options(create_place.language)" v-validate="'required'" :name="'additional_detail_key_'+index" :ref="'additional_detail_key_'+index"/>
                                            <vs-input style="color: grey;" placeholder="key" v-validate="'required|max:100'" :name="'additional_detail_key_'+index" :ref="'additional_detail_key_'+index" v-model="additionalDetail.key" />
                                          </div>
                                        </template>

                                        <vs-input v-validate="'required|max:500'" placeholder="value" :name="'additional_detail_value_'+index" :ref="'additional_detail_value_'+index" v-model="additionalDetail.value" />

                                        <template slot="append">
                                          <div class="append-text btn-addon" style="background-color: #e7e7e7;">
                                            <vs-button @click="removeField(languageIndex, index)" class="" color="danger" type="filled" icon-pack="feather" icon="icon-x"></vs-button>
                                          </div>
                                        </template>
                                      </vx-input-group>
                                      <span class="text-danger text-sm" v-show="errors.has('addPlaceForm_'+languageIndex+'.additional_detail_key_'+index)">This key field is required</span>
                                      <span class="text-danger text-sm" v-show="errors.has('addPlaceForm_'+languageIndex+'.additional_detail_value_'+index)">This value field is required</span>
                                    </div>
                                </div> -->
                            </div>
                          </form>
                        </vs-tab>
                    </vs-tabs>
                </div>
            </div>

            <vs-divider position="left"> Categories </vs-divider>

            <div class="flex flex-wrap items-center justify-end vx-row mb-2 mb-base">
                <div  class="vx-col w-9/12 mb-2">
                    <treeselect v-model="place_categories" :multiple="true" :options="place_categories_options" />
                </div>
                <div  class="vx-col w-3/12 mb-2" align="right">
                    <vs-button class="justify-end" color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addCategory()">Add Category</vs-button>
                 
                    <vs-popup  classContent="popup-example h-full" title="Create Category" :active.sync="activePromptAddCategory">
                        <div id="createCategoryLoadingDiv" class="vs-con-loading__container" v-if="create_catategories.length">
                          <vs-tabs color="primary" v-model="activeTab">
                            <vs-tab active :label="create_cat.language" v-for="(create_cat, languageIndex) in create_catategories">
                              <form :data-vv-scope="'addCategoryForm_'+languageIndex">
                                <div class="vx-row">
                                  <div class="vx-col sm:w-full mb-2">
                                    <vs-input class="w-full" v-validate="'required'" label-placeholder="Name" :ref="'name_'+languageIndex" :name="'name_'+languageIndex" v-model="create_cat.name"/>
                                    <span class="text-danger text-sm"  v-show="errors.has('addCategoryForm_'+languageIndex+'.name_'+languageIndex)">This field is required</span>
                                  </div>
                                </div>
                              </form>
                            </vs-tab>
                          </vs-tabs>

                          <div class="vx-row px-3">
                            <div class="vx-col sm:w-full mb-2">
                               <VueFileAgent
                                ref="vueCatFileAgendsdt"
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
                                @select="catfilesSelected($event)"
                                @beforedelete="catonBeforeDelete($event)"
                                @delete="catfileDeleted($event)"
                                v-model="cat_image"
                              ></VueFileAgent>
                            </div>
                          </div>

                          <div  class="vx-row mt-4">
                            <div  class="vx-col w-1/2 mb-2">
                              
                            </div>
                            <div  class="vx-col w-1/2 mb-2" align="right">
                              <vs-button  v-on:click.prevent="validateAddCatForm()" color="primary" type="filled">Create Category</vs-button>
                            </div>
                          </div>
                        </div>
                    </vs-popup>
                </div>
            </div>
            
            <vs-divider position="left"> Groups </vs-divider>

            <div class="vx-row mb-base">
                <div  class="vx-col w-9/12 mb-2">
                    <treeselect v-model="place_groups" :multiple="true" :options="place_groups_options" />
                </div>

                <div  class="vx-col w-3/12 mb-2" align="right">
                    <vs-button class="justify-end" color="primary" type="filled" icon-pack="feather" icon="icon-plus-circle" @click="addGroup()">Add Group</vs-button>

                    <vs-popup  classContent="popup-example h-full" title="Create Group" :active.sync="activePromptAddGroup">
                        <div id="createGroupLoadingDiv" class="vs-con-loading__container" v-if="create_groups.length">
                          <vs-tabs color="primary" v-model="activeGrpTab">
                            <vs-tab active :label="create_group.language" v-for="(create_group, languageIndex) in create_groups">
                              <form :data-vv-scope="'addGroupForm_'+languageIndex">
                                <div class="vx-row">
                                  <div class="vx-col sm:w-3/4 mb-2">
                                    <vs-input class="w-full" v-validate="'required'" label-placeholder="Name" :ref="'name_'+languageIndex" :name="'name_'+languageIndex" v-model="create_group.name"/>
                                    <span class="text-danger text-sm"  v-show="errors.has('addGroupForm_'+languageIndex+'.name_'+languageIndex)">This field is required</span>
                                  </div>
                                  <div class="vx-col sm:w-1/4 mb-2">
                                    <label>Color</label><br>
                                    <input style="width: 100px;" class="absolute cursor-pointer" type="color" v-model="add_color">
                                  </div>
                                </div>
                              </form>
                            </vs-tab>
                          </vs-tabs>

                          <div class="vx-row px-3">
                            <div class="vx-col sm:w-full mb-2">
                               <VueFileAgent
                                ref="vueGrpFileAgendsdt"
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
                                @select="grpfilesSelected($event)"
                                @beforedelete="grponBeforeDelete($event)"
                                @delete="grpfileDeleted($event)"
                                v-model="grp_image"
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
                </div>
            </div>

            <vs-divider position="left"> Open time </vs-divider>

            <div  class="vx-row">
                <div  class="vx-col w-2/12 mb-2">
                    <vs-radio v-model="time_type" vs-value="any_time_open">Any time open</vs-radio>
                </div>
                <div  class="vx-col w-4/12 mb-2">
                    <vs-radio v-model="time_type" vs-value="week_days">By week days</vs-radio>
                    <div  class="vx-row mb-1 pl-2" v-for="(weekDay, index) in time_week_days" :key="index">
                        <vs-checkbox :disabled="time_type!='week_days'" v-model="weekDay.selected">{{weekDay.day}}</vs-checkbox>
                        <flat-pickr :disabled="time_type!='week_days' || !weekDay.selected" style="width:100px" :config="configdateTimePicker" v-model="weekDay.start_time" placeholder="Start time" />
                        <flat-pickr :disabled="time_type!='week_days' || !weekDay.selected" style="width:100px" :config="configdateTimePicker" v-model="weekDay.end_time" placeholder="End time" />
                    </div>
                </div>
                <div  class="vx-col w-6/12 mb-2">
                    <div  class="vx-row">
                        <div  class="vx-col w-1/2">
                            <vs-radio v-model="time_type" vs-value="custom_dates">Custom dates</vs-radio>
                        </div>
                        <div  class="vx-col w-1/2" align="right">
                            <vs-button :disabled="time_type!='custom_dates'" @click="addCustomDays()" align="right" color="primary" type="filled" icon-pack="feather" icon="icon-plus"></vs-button>
                        </div>
                    </div>

                 
                    <form data-vv-scope="customTimeForm">
                        <div v-for="(customDay, index) in time_custom_days" :key="index">
                            <div  class="vx-row mb-1 pl-4" >
                                <datepicker :disabled="time_type!='custom_dates'" v-validate="'required'" :name="'start_date_'+index" style="width:100px" placeholder="Select Date" v-model="customDay.start_date"></datepicker>
                                <datepicker :disabled="time_type!='custom_dates'" v-validate="'required'" :name="'end_date_'+index" style="width:100px" placeholder="Select Date" v-model="customDay.end_date"></datepicker>
                                <vs-input :disabled="time_type!='custom_dates'" style="color: grey;" placeholder="Title" v-model="customDay.title" />
                                <vs-button :disabled="time_type!='custom_dates'" @click="removeCustomDays(index)" color="danger" type="filled" icon-pack="feather" icon="icon-x"></vs-button>
                            </div>
                            <div  class="vx-row mb-1 pl-2" v-for="(customDayTimes, index) in customDay.times" :key="index">
                                <vs-checkbox :disabled="time_type!='custom_dates'" v-model="customDayTimes.selected">{{customDayTimes.day}}</vs-checkbox>
                                <flat-pickr :disabled="time_type!='custom_dates' || !customDayTimes.selected" style="width:100px" :config="configdateTimePicker" v-model="customDayTimes.start_time" placeholder="Start time" />
                                <flat-pickr :disabled="time_type!='custom_dates' || !customDayTimes.selected" style="width:100px" :config="configdateTimePicker" v-model="customDayTimes.end_time" placeholder="End time" />
                            </div>
                            <span class="text-danger text-sm" v-show="errors.has('customTimeForm.start_date_'+index)">This start date field is required</span><br>
                            <span class="text-danger text-sm" v-show="errors.has('customTimeForm.end_date_'+index)">This end date field is required</span>
                            <vs-divider />
                        </div>
                    </form>
                </div>
            </div>

            <vs-divider position="left"> Images </vs-divider>

            <div class="vx-row px-3">
                <div class="vx-col sm:w-full mb-2">
                   <VueFileAgent
                    ref="vueFileAgendsdt"
                    :theme="'list'"
                    :multiple="true"
                    :deletable="true"
                    :meta="true"
                    :compact="true"
                    :accept="'image/*'"
                    :maxSize="'5MB'"
                    :helpText="'Choose images'"
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

            <vs-divider position="left"> Location </vs-divider>

            <treeselect :multiple="false" :async="true" :load-options="loadOptions" v-model="place_location" />

            <vs-divider />

            <div  class="vx-row">
                <div  class="vx-col w-1/2 mb-2">
                  
                </div>
                <div  class="vx-col w-1/2 mb-2" align="right">
                    <vs-button  v-on:click.prevent="addPlace()" color="primary" type="filled">Create Place</vs-button>
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

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

import Datepicker from 'vuejs-datepicker';

import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { ASYNC_SEARCH } from '@riophae/vue-treeselect'

const simulateAsyncOperation = fn => {
  setTimeout(fn, 2000)
}

export default {
    components: {
        vSelect,
        Treeselect,
        flatPickr,
        Datepicker,
    },
    data() {
        return {
            type_options : [
                { value : 'place', text : 'Place' },
                { value : 'event', text : 'Event' },
                { value : 'tip', text : 'Tip' },
            ],
            type : "place",
            selected:[],
            key : null, 
            active : null,
            search : null,
            totalPage: 1,
            currentPage: 1,
            activeTab : 0,
            categories : [],
            image : [],
            fileRecordsForUpload : [],
            place_groups : [],
            place_categories : [],
            place_filters : [],
            place_location : null,
            place_location_options : [],
            create_places : [
                // {
                //   language : "en",
                //   name : null,
                //   description : null,
                //   readonly : true,
                // },
            ],
            additional_details : [],
            time_type : "week_days",
            time_week_days : [
                { day : "Monday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Tuesday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Wednesday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Thursday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Friday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Saturday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Sunday", start_time : "9.00", end_time : "17.00", selected : true },
            ],
            time_custom_days : [
                { title : null, start_date : null, end_date : null, times : [
                    { day : "Monday", start_time : "9.00", end_time : "17.00", selected : true },
                    { day : "Tuesday", start_time : "9.00", end_time : "17.00", selected : true },
                    { day : "Wednesday", start_time : "9.00", end_time : "17.00", selected : true },
                    { day : "Thursday", start_time : "9.00", end_time : "17.00", selected : true },
                    { day : "Friday", start_time : "9.00", end_time : "17.00", selected : true },
                    { day : "Saturday", start_time : "9.00", end_time : "17.00", selected : true },
                    { day : "Sunday", start_time : "9.00", end_time : "17.00", selected : true },
                ]},
            ],
            configdateTimePicker: {
              enableTime: true,
              enableSeconds: true,
              noCalendar: true,
              dateFormat: 'H.i'
            },
            selectedOption : null,
            selectedOptionIndex : null,
            selectedOptionLangIndex : null,

            create_catategories : [],
            cat_image : [],
            catFileRecordsForUpload : [],
            activePromptAddCategory : false,
            activeTab : 0,

            activeGrpTab : 0,
            activePromptAddGroup : false,
            create_groups : [],
            grp_image : [],
            grpFileRecordsForUpload : [],
            add_color : "#FF9300",
        }
    },
    watch: {
        currentPage(val) {
            this.searchTerms()
        }
    },
    computed: {
        place_categories_options(){
            let categories = this.$store.state.placeManagement.categories
            let categoriesData = []

            categories.forEach(function(entry, key) {
                categoriesData.push({
                    id : entry.id,
                    title : entry.name.en,
                    label : entry.name.en,
                })
            });

            return categoriesData
        },
        place_groups_options(){
            let groups = this.$store.state.placeManagement.groups
            let groupsData = []

            groups.forEach(function(entry, key) {
                groupsData.push({
                    id : entry.id,
                    title : entry.name.en,
                    label : entry.name.en,
                })
            });

            return groupsData
        },
    },
    methods: {
        addCategory() {
          this.activeTab = 0
          this.activePromptAddCategory = true
        },
        async validateAddCatForm() {
          var respomce = true
          for (let i = 0; i < this.create_catategories.length; i++){
            await this.$validator.validateAll('addCategoryForm_'+i).then(result => {
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
              container: '#createCategoryLoadingDiv',
              scale: 0.6
          })

          let data = new FormData();
          for (let i = 0; i < this.create_catategories.length; i++){
            if(this.create_catategories[i].name) data.append('name['+this.create_catategories[i].language+']', this.create_catategories[i].name);
          }

          if(this.cat_image.length) data.append('image', this.cat_image[0].file);

          this.$store.dispatch("placeManagement/createCategory", data)
            .then(res => { 
                this.cat_image = [];
                this.$vs.loading.close('#createCategoryLoadingDiv > .con-vs-loading')
                this.activePromptAddCategory = false
                this.$vs.notify({
                    title: "Success.",
                    text: "Category created successfully.",
                    iconPack: "feather",
                    icon: "icon-alert-circle",
                    color: "success"
                });
            })
            .catch(err => { 
              this.$vs.loading.close('#createCategoryLoadingDiv > .con-vs-loading')
              Object.keys(err.data.errors).forEach(function(key) {
                self.errors.add({
                  field: key,
                  scope: "addUserForm",
                  msg: err.data.errors[key][0],
                });
              });
            })
        },
        addGroup() {
          this.activeGrpTab = 0
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

          if(respomce) this.createGrpApi()
        },
        createGrpApi() {
          var self = this
          this.$vs.loading({
              container: '#createGroupLoadingDiv',
              scale: 0.6
          })

          let data = new FormData();
          for (let i = 0; i < this.create_groups.length; i++){
            if(this.create_groups[i].name) data.append('name['+this.create_groups[i].language+']', this.create_groups[i].name);
          }

          if(this.add_color) data.append('color', this.add_color);
          if(this.grp_image.length) data.append('image', this.grp_image[0].file);

          this.$store.dispatch("placeManagement/createGroup", data)
            .then(res => { 
                this.grp_image = [];
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
        catfilesSelected: function (fileRecordsNewlySelected) {
            var validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
            this.catFileRecordsForUpload = this.catFileRecordsForUpload.concat(validFileRecords);
        },
        catonBeforeDelete: function (fileRecord) {
            // this.$refs.vueCatFileAgendsdt.deleteFileRecord(fileRecord);
            var i = this.catFileRecordsForUpload.indexOf(fileRecord);
            if (i !== -1) {
            // queued file, not yet uploaded. Just remove from the arrays
              this.catFileRecordsForUpload.splice(i, 1);
              var k = this.cat_image.indexOf(fileRecord);
              if (k !== -1) this.cat_image.splice(k, 1);
            } else {
              this.$refs.vueCatFileAgendsdt.deleteFileRecord(fileRecord);
            }
        },
        catfileDeleted: function (fileRecord) {
            this.$refs.vueCatFileAgendsdt.deleteUpload(fileRecord);
        },
        grpfilesSelected: function (fileRecordsNewlySelected) {
            var validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
            this.grpFileRecordsForUpload = this.grpFileRecordsForUpload.concat(validFileRecords);
        },
        grponBeforeDelete: function (fileRecord) {
            // this.$refs.vueCatFileAgendsdt.deleteFileRecord(fileRecord);
            var i = this.grpFileRecordsForUpload.indexOf(fileRecord);
            if (i !== -1) {
            // queued file, not yet uploaded. Just remove from the arrays
              this.grpFileRecordsForUpload.splice(i, 1);
              var k = this.grp_image.indexOf(fileRecord);
              if (k !== -1) this.grp_image.splice(k, 1);
            } else {
              this.$refs.vueGrpFileAgendsdt.deleteFileRecord(fileRecord);
            }
        },
        grpfileDeleted: function (fileRecord) {
            this.$refs.vueGrpFileAgendsdt.deleteUpload(fileRecord);
        },
        deleteUploadedFile: function (fileRecord) {
            this.$refs.vueCatFileAgendsdt.deleteUpload(this.uploadUrl, this.uploadHeaders, fileRecord);
        },
        place_filters_options(lang){
            let filters = this.$store.state.placeManagement.filters
            let filtersData = []

            filters.forEach(function(entry, key) {
                filtersData.push({
                    id : entry.key,
                    title : entry.name[lang] ? entry.name[lang] : entry.name.en,
                    label : entry.name[lang] ? entry.name[lang] : entry.name.en,
                })
            });

            return filtersData
        },
        place_filters_options_values(lang, languageIndex, additionalDetailsIndex){
            var self = this
            var selectedOption = this.create_places[languageIndex].additional_details[additionalDetailsIndex].key 
            if(selectedOption){
                let filters = this.$store.state.placeManagement.filters
                var filterArray = filters.filter(function (el) {
                  return el.key == selectedOption;
                });

                if(filterArray && filterArray.length && filterArray[0].options){
                    let filtersData = []
                    filterArray[0].options.forEach(function(entry, key) {
                        filtersData.push({
                            id : entry.id,
                            label : entry.options[lang] ? entry.options[lang] : entry.options['en'] ? entry.options['en'] : null,
                            title : entry.options[lang] ? entry.options[lang] : entry.options['en'] ? entry.options['en'] : null,
                        })
                    });

                    return filtersData;
                }

                return []
            }
            else return [];
        },
        loadOptions({ action, searchQuery, callback }) {
          if (action === ASYNC_SEARCH) {
            simulateAsyncOperation(() => {
                var self = this;
                var mapResults = [];
                const byteArray = encodeURIComponent(searchQuery);
                mapboxgl.accessToken = "pk.eyJ1IjoibmF5YW5hbiIsImEiOiJja3BtNzlpdTgwZjd4Mm9xcTYwbmtpdzZzIn0.fXsRJJcqT2vatoXlS1N5Qg";
                fetch(
                    "https://api.mapbox.com/geocoding/v5/mapbox.places/"+byteArray+".json?access_token="+mapboxgl.accessToken
                )
                .then((res) => res.json())
                .then((res) => {
                    self.place_location_options = res.features;
                    mapResults = res.features.map(location => ({
                        id: location.id,
                        label: location.place_name,
                    }))

                    callback(null, mapResults)
                })
                .catch((err) => {
                      console.log(err);
                })
            })
          }
        },
        addCustomDays() {
            this.time_custom_days.push({ title : null, start_date : null, end_date : null, times : [
                { day : "Monday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Tuesday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Wednesday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Thursday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Friday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Saturday", start_time : "9.00", end_time : "17.00", selected : true },
                { day : "Sunday", start_time : "9.00", end_time : "17.00", selected : true },
            ]})
        },
        changeKey(languageIndex, additionalDetailsIndex){
            let value = this.create_places[languageIndex].additional_details[additionalDetailsIndex].key
            if(value){
                this.selectedOption = value;
                this.selectedOptionLangIndex = languageIndex;
                this.selectedOptionIndex = additionalDetailsIndex;

                for (let i = 0; i < this.create_places.length; i++){
                    this.create_places[i].additional_details[additionalDetailsIndex].key = value
                    this.create_places[i].additional_details[additionalDetailsIndex].value = null
                }
            }
        },
        changeKeyValue(languageIndex, additionalDetailsIndex){
            let value = this.create_places[languageIndex].additional_details[additionalDetailsIndex].value
            if(value){
                for (let i = 0; i < this.create_places.length; i++){
                    this.create_places[i].additional_details[additionalDetailsIndex].value = value
                }
            }
        },
        removeCustomDays(index) {
          this.time_custom_days.splice(index, 1);
        },
        removeLanguage(languageIndex, lang) {
          this.activeTab = this.activeTab -1;
          var lis = document.querySelectorAll('#createPlaceLoadingDiv .placesTab ul li');

          if(lis && lis[languageIndex]){
            lis[languageIndex].style.display = "none";
            // lis[languageIndex].remove();
          }
        },
        addLanguage() {
          let languagesCount = this.create_places.length;
          languagesCount ++;
          this.create_places.push({
            language : 'language '+languagesCount,
            name : null,
            description : null,
            readonly : false,
          })
        },
        addNewField(languageIndex) {
            for (let i = 0; i < this.create_places.length; i++){
                this.create_places[i].additional_details.push({ key : null, value : null})
            }
            // this.create_places[languageIndex].additional_details.push({ key : "", value : ""})
        },
        removeField(languageIndex, index) {
            for (let i = 0; i < this.create_places.length; i++){
                this.create_places[i].additional_details.splice(index, 1);
            }
            // this.create_places[languageIndex].additional_details.splice(index, 1);
        },
        async addPlace(){
            var responce = true
            for (let i = 0; i < this.create_places.length; i++){
                await this.$validator.validateAll('addPlaceForm_'+i).then(result => {
                    if (!result){
                        responce = false;
                    }
                })
            }

            if(this.time_type == 'custom_dates'){
                await this.$validator.validateAll('customTimeForm').then(result => {
                    if (!result){
                        responce = false;
                    }
                })
            }

            if(responce) this.addPlaceApi()
        },
        async addPlaceApi(){
            var self = this
            this.$vs.loading({
                container: '#createPlaceLoadingDiv',
                scale: 0.6
            })

            let data = new FormData();

            if(this.place_location && this.place_location_options.length){
                var filterArray = this.place_location_options.filter(function (el) {
                  return el.id == self.place_location;
                });

                if(filterArray && filterArray.length){
                    data.append('location', JSON.stringify(filterArray[0]));
                }
            }

            for (let i = 0; i < this.create_places.length; i++){
                if(this.create_places[i].name) data.append('name['+this.create_places[i].language+']', this.create_places[i].name);
                if(this.create_places[i].description) data.append('description['+this.create_places[i].language+']', this.create_places[i].description);

                if(this.create_places[i].additional_details && this.create_places[i].additional_details.length){
                    for (let j = 0; j < this.create_places[i].additional_details.length; j++){
                        if(this.create_places[0].additional_details[j].key) data.append('additional_details['+this.create_places[0].additional_details[j].key+']', this.create_places[0].additional_details[j].value);
                    }
                }
            }

            data.append('type', this.type);
            data.append('time_type', this.time_type);
            data.append('open_type', this.time_type);

            if(this.time_type == 'custom_dates' && this.time_custom_days.length){
                for (let i = 0; i < this.time_custom_days.length; i++){
                    data.append('time_custom_days['+i+'][title]', this.time_custom_days[i].title);

                    if(this.time_custom_days[i].start_date){
                        var startDate = this.time_custom_days[i].start_date;
                        data.append('time_custom_days['+i+'][start_date]', startDate.toISOString().substring(0, 10));
                    }

                    if(this.time_custom_days[i].end_date){
                        var endDate = this.time_custom_days[i].end_date;
                        data.append('time_custom_days['+i+'][end_date]', endDate.toISOString().substring(0, 10));
                    }

                    // data.append('time_custom_days['+i+'][start_date]', this.time_custom_days[i].start_date);
                    // data.append('time_custom_days['+i+'][end_date]', this.time_custom_days[i].end_date);
                
                    if(this.time_custom_days[i].times.length){
                        for (let j = 0; j < this.time_custom_days[i].times.length; j++){
                            data.append('time_custom_days['+i+'][times]['+j+'][day]', this.time_custom_days[i].times[j].day);
                            data.append('time_custom_days['+i+'][times]['+j+'][start_time]', this.time_custom_days[i].times[j].start_time.substring(0,5));
                            data.append('time_custom_days['+i+'][times]['+j+'][end_time]', this.time_custom_days[i].times[j].end_time.substring(0,5));
                            data.append('time_custom_days['+i+'][times]['+j+'][selected]', this.time_custom_days[i].times[j].selected);
                        }
                    }
                }
            }

            if(this.time_type == 'week_days' && this.time_week_days.length){
                for (let i = 0; i < this.time_week_days.length; i++){
                    data.append('time_week_days['+i+'][day]', this.time_week_days[i].day);
                    data.append('time_week_days['+i+'][start_time]', this.time_week_days[i].start_time.substring(0,5));
                    data.append('time_week_days['+i+'][end_time]', this.time_week_days[i].end_time.substring(0,5));
                    data.append('time_week_days['+i+'][selected]', this.time_week_days[i].selected);
                }
            }

            if(this.place_categories.length){
                for (let i = 0; i < this.place_categories.length; i++){
                     data.append('categories[]', this.place_categories[i]);
                }
            }

            if(this.place_groups.length){
                for (let i = 0; i < this.place_groups.length; i++){
                     data.append('groups[]', this.place_groups[i]);
                }
            }

            if(this.image.length){
                for (let i = 0; i < this.image.length; i++){
                     data.append('images[]', this.image[i].file);
                }
            }

            this.$store.dispatch("placeManagement/createPlace", data)
            .then(res => { 
                this.$vs.loading.close('#createPlaceLoadingDiv > .con-vs-loading')
                this.$vs.notify({
                    title: "Success.",
                    text: "Place created successfully.",
                    iconPack: "feather",
                    icon: "icon-alert-circle",
                    color: "success"
                });

                this.$router.push("/places/"+res.data.data.id).catch(() => {})
            })
            .catch(err => { 
                this.$vs.loading.close('#createPlaceLoadingDiv > .con-vs-loading')
                // Object.keys(err.data.errors).forEach(function(key) {
                //     self.errors.add({
                //         field: key,
                //         scope: "addUserForm",
                //         msg: err.data.errors[key][0],
                //     });
                // });
            })


            // console.log(data)
        },
        // addNewField() {
        //     this.additional_details.push({ key : "", value : ""})
        // },
        // removeField(index) {
        //     this.additional_details.splice(index, 1);
        // },
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
    },
    mounted() {
        var self = this
        this.categories = this.$store.state.placeManagement.categories
        this.place_filters = this.$store.state.placeManagement.filters

        this.create_places = [];
        var appLanguages = this.$store.state.placeManagement.languages
        for (let i = 0; i < appLanguages.length; i++){
          self.create_places.push({
            language : appLanguages[i].key,
            name : null,
            description : null,
            readonly : appLanguages[i].name == "English" ? true : false,
            additional_details : [],
          })
        }

        this.create_catategories = [];
        var appLanguages = this.$store.state.placeManagement.languages
        for (let i = 0; i < appLanguages.length; i++){
          self.create_catategories.push({
            language : appLanguages[i].key,
            name : null,
            readonly : appLanguages[i].name == "English" ? true : false,
          })
        }

        this.create_groups = [];
        var appLanguages = this.$store.state.placeManagement.languages
        for (let i = 0; i < appLanguages.length; i++){
          self.create_groups.push({
            language : appLanguages[i].key,
            name : null,
            readonly : appLanguages[i].name == "English" ? true : false,
          })
        }
    },
    async created() {
        var self = this
        if(!modulePlaceManagement.isRegistered) {
            this.$store.registerModule('placeManagement', modulePlaceManagement)
            modulePlaceManagement.isRegistered = true
        }

        await this.$store.dispatch("placeManagement/viewLanguage")
        this.create_places = [];
        var appLanguages = this.$store.state.placeManagement.languages

        for (let i = 0; i < appLanguages.length; i++){
          self.create_places.push({
            language : appLanguages[i].key,
            name : null,
            description : null,
            readonly : appLanguages[i].name == "English" ? true : false,
            additional_details : [],
          })
        }


        await this.$store.dispatch("placeManagement/viewLanguage")
        this.create_groups = [];
        this.create_catategories = [];

        for (let i = 0; i < appLanguages.length; i++){
          self.create_catategories.push({
            language : appLanguages[i].key,
            name : null,
            readonly : appLanguages[i].name == "English" ? true : false,
          })
        }

        for (let i = 0; i < appLanguages.length; i++){
          self.create_groups.push({
            language : appLanguages[i].key,
            name : null,
            readonly : appLanguages[i].name == "English" ? true : false,
          })
        }

        await this.$store.dispatch("placeManagement/viewCategoryWithoutPaginate", {avoid_paginate : "true"})
        await this.$store.dispatch("placeManagement/viewGroupWithoutPaginate", {avoid_paginate : "true"})
        await this.$store.dispatch("placeManagement/viewFilterWithoutPaginate", {avoid_paginate : "true"})
        this.place_filters = this.$store.state.placeManagement.filters

        await this.$store.dispatch("placeManagement/viewPlace")


    },
}
</script>
<style type="text/css">
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.vs-con-textarea{
    height: 200px;
}

.vs-textarea{
  height: 200px;
}

.vs-divider--text {
    padding-left: 0px !important;
}

</style>

