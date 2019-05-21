<template>
  <q-page class="flex flex-center">
    <div class="column">
      <h1>Detalles</h1>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  props: {
    tk: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  name: 'PageOrders',
  mounted () {}
}
</script>
