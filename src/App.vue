<template>
  <div id="app">
    <router-view />
    <ApiSelect />
  </div>
</template>

<script>
import ApiSelect from '@/components/ApiSelect/ApiSelect'

export default {
  name: 'App',

  components: {
    ApiSelect,
  },
}
</script>

<style scoped></style>
