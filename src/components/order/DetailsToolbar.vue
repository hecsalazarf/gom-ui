<template>
  <q-toolbar>
    <q-btn class="q-mr-sm" icon="arrow_back_ios" flat dense @click="$router.back()"/>
     <q-avatar
      rounded
      size="2.5em"
      icon="input"
      color="accent"
      text-color="white"
    >
      <q-badge floating color="teal">Nuevo</q-badge>
    </q-avatar>
    <div class="column self-stretch q-ml-md items-start justify-start content-start">
      <div class="col-5 text-subtitle1">Soda bien fria</div>
      <div class="col text-subtitle2 text-weight-regular">Juanito Perez</div>
    </div>
    <!-- <q-toolbar-title class="text-subtitle1">Soda fria</q-toolbar-title> -->
    <q-space />
    <q-btn flat dense icon="more_horiz"/>
  </q-toolbar>
</template>

<script>
export default {
  name: 'OrderToolbar',
  data () {
    return {}
  }
}
</script>

<style>
</style>
