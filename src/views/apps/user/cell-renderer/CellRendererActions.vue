<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <feather-icon icon="EditIcon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" />
      <feather-icon icon="TrashIcon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="confirmDeleteRecord" />
    </div>
</template>


<script>
  import moduleRoleManagement from '@/store/role-management/moduleRoleManagement.js'

  export default {
      name: 'CellRendererActions',
      props: {
        data: {
          type: Object,
          required: true,
        },
      },
      methods: {
        editRecord() {
          this.$router.push("/users/" + this.data.id).catch(() => {})
        },
        editRedsdscord() {
          this.$router.push("/users/" + this.data.id).catch(() => {})
        },
        confirmDeleteRecord() {
          this.$vs.dialog({
            type: 'confirm',
            color: 'danger',
            title: `Confirm Delete`,
            text: `You are about to delete ${this.data.first_name} ${this.data.last_name} ?`,
            accept: this.acceptAlert,
            acceptText: "Delete"
          })
        },
        acceptAlert() {
          this.$vs.loading({ color: '#ff8000' })

          this.$store.dispatch("roleManagement/deleteUser", this.data.id)
            .then(res => { 
              this.$vs.loading.close()
              this.$router.push("/users").catch(() => {})

              this.$vs.notify({
                title: "Success.",
                text: "User deleted successfully.",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "danger"
              });
            })
            .catch(err => { 
              this.$vs.loading.close()
            })
        },
        deleteRecord() {
          /* Below two lines are just for demo purpose */
          this.showDeleteSuccess()

          /* UnComment below lines for enabling true flow if deleting user */
          // this.$store.dispatch("userManagement/removeRecord", this.data.id)
          //   .then(()   => { this.showDeleteSuccess() })
          //   .catch(err => { console.error(err)       })
        },
        showDeleteSuccess() {
          this.$vs.notify({
            color: 'success',
            title: 'User Deleted',
            text: 'The selected user was successfully deleted'
          })
        }
      },
      async created() {
        if(!moduleRoleManagement.isRegistered) {
          this.$store.registerModule('roleManagement', moduleRoleManagement)
          moduleRoleManagement.isRegistered = true
        }
      }
    }
</script>
