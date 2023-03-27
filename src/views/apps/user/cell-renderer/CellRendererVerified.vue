<template>
    <feather-icon icon="CircleIcon" :svgClasses="['fill-current h-4 w-4', textColor]" />
</template>

<script>
    export default {
        name: 'CellRendererVerified',
        props: {
          data: {
            type: Object,
            required: true,
          },
        },
        computed: {
          textColor() {
            return (this.data.email_verified_at == null ) ? "text-grey" : "text-success";
          }
        }
    }
</script>
