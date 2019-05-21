<template>
  <q-toolbar>
    <q-icon name="graphic_eq" class="text-white text-h4"/>
    <q-toolbar-title>GOM</q-toolbar-title>
    <q-btn flat round>
      <q-menu>
        <q-list dense>
          <q-item clickable v-close-popup>
            <q-item-section>Salir</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <q-avatar color="accent" text-color="white" icon="person"/>
    </q-btn>
  </q-toolbar>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {}
  }
}
</script>

<style>
</style>
