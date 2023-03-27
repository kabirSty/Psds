<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-order-request">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">

          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col sm:w-full md:w-full lg:w-1/2">
              <div v-if="order && supplier_order" class="px-8 pt-8 login-tabs-container">
                <vs-input readonly label-placeholder="Quantity" name="name" v-model="order.quantity" class="mt-5 mb-base w-full" />

                <vs-input readonly label-placeholder="Date" name="name" v-model="order.date_time" class="mt-5 mb-base w-full" />
                
                <vs-textarea readonly label="Description" v-model="order.description" class="mt-5 mb-base w-full" />

                <vs-divider/>

                <vs-textarea readonly label="Description" v-model="supplier_order.request_data.description" class="mt-base mb-base w-full" />
              </div>

              <div v-else-if="disableFilds"  class="px-8 pt-8 login-tabs-container">
                <vs-alert color="danger" title="Order not found" >
                  <span>Your requested order data not found or expired.</span>
                </vs-alert>
              </div>
            </div>

            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="px-8 pt-8 login-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">Order</h4>
                  <p>Add your quotation</p>
                </div>

                <div class="mt-base">
                  <vs-input
                      v-validate="'required|numeric'"
                      data-vv-validate-on="blur"
                      name="price"
                      icon-no-border
                      icon="icon icon-dollar-sign"
                      icon-pack="feather"
                      label-placeholder="Price"
                      v-model="price"
                      class="w-full"/>
                  <span class="text-danger text-sm">{{ errors.first('price') }}</span>

                  <vs-textarea label="Description" v-model="description" class="mt-base mb-base w-full" />

                  <div align="right" class="mb-3">
                    <vs-button :disabled="!validateForm" @click="addOrderRequest">Submit Price</vs-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import axios from "@/http/axios/index.js"

export default {
  components: {

  },
  data() {
    return {
      price: '',
      description: '',
      checkbox_remember_me: false,
      order: null,
      supplier_order: null,
      orderId: null,
      supplierId: null,
      disableFilds: false,
    }
  },
  
  computed: {
    validateForm() {
      return !this.errors.any() && this.price != '' && !this.disableFilds;
    },
  },
  methods: {
    addOrderRequest() {
      this.$vs.loading()

      let data = {
        order : this.orderId, 
        supplier : this.supplierId,
        price : this.price,
        description : this.description,
      }

      axios.post("/api/auth/addOrderRequest", data)
        .then((response) => {
          this.$vs.loading.close() 
          
          this.$vs.notify({
            title: 'Success',
            text: 'Quotation successfully added !',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'success'
          })
        })
        .catch((error) => {
          this.$vs.loading.close() 
       })
    },
    fetchOrderData(order, supplier) {
      this.$vs.loading()

      axios.post("/api/auth/getOrderRequest", {order : order, supplier : supplier})
        .then((response) => {
          this.$vs.loading.close() 
          
          if(response && response.status && response.status == 201){
            this.order =  response.data.order
            this.supplier_order =  response.data.supplier_order
          }
          else{
            this.disableFilds = true
          }
        })
        .catch((error) => {
          this.$vs.loading.close() 
          this.disableFilds = true
         // reject(error) 
       })
    },
  },
  mounted() {
    this.orderId = this.$route.query.order
    this.supplierId = this.$route.query.supplier
    
    if(this.orderId && this.supplierId) this.fetchOrderData(this.orderId, this.supplierId)
  },
  created() {

  },
}
</script>

<style lang="scss">
.login-tabs-container {
  min-height: 505px;

  .con-tab {
    padding-bottom: 14px;
  }

  .con-slot-tabs {
    margin-top: 1rem;
  }
}
</style>
