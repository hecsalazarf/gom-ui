<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="accent" icon="person_add"/>
    </q-page-sticky>
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
    }
  },
  name: 'PageIndex',
  mounted () {
  }
}
</script>
