<template>
  <div class="flex items-center">
    <vs-avatar :src="data.image" class="flex-shrink-0 mr-2" size="30px" @click="$router.push(url)" />
    <router-link :to="url" @click.stop.prevent class="text-inherit hover:text-primary">
      <span>{{ data.first_name }}</span>
      <span>&nbsp;</span>
      <span>{{ data.last_name }}</span>
    </router-link>
  </div>
</template>

<script>
    export default {
        name: 'CellRendererLink',
        props: {
          data: {
            type: Object,
            required: true,
          },
        },
        computed: {
          url() {
            return "/users/"+this.data.id
          }
        }
    }
</script>
