<template>
    <vs-chip class="ag-grid-cell-chip" :color="chipColor(data.status)">
      <span>{{ toUpperCase(data.status) }}</span>
    </vs-chip>
</template>

<script>
    export default {
        name: 'CellRendererStatus',
        props: {
          data: {
            type: Object,
            required: true,
          },
        },
        computed: {
          chipColor() {
            return (value) => {
              if(value === "active") return "success"
              // else if(value === "blocked") return "danger"
              // else if(value === "deactivated") return "warning"
              else "warning"
            }
          }
        },
        methods : {
          toUpperCase(string){
            return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
          }
        }
    }
</script>

<style lang="scss" scpoped>
.ag-grid-cell-chip {
  &.vs-chip-success {
    background: rgba(var(--vs-success),.15);
    color: rgba(var(--vs-success),1) !important;
    font-weight: 500;
  }
  &.vs-chip-warning {
    background: rgba(var(--vs-warning),.15);
    color: rgba(var(--vs-warning),1) !important;
    font-weight: 500;
  }
  &.vs-chip-danger {
    background: rgba(var(--vs-danger),.15);
    color: rgba(var(--vs-danger),1) !important;
    font-weight: 500;
  }
}
</style>
