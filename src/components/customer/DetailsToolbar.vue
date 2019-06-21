<template>
  <q-toolbar>
    <q-btn class="q-mr-sm" icon="arrow_back_ios" flat dense @click="$router.back()"/>
    <div class="column items-start justify-center content-start ellipsis">
      <div class="col-5 text-subtitle1 text-weight-medium">Adriana Sanchez</div>
    </div>
    <q-space/>
    <q-btn flat dense icon="more_horiz">
      <q-menu>
        <q-list>
          <q-item
            clickable
            v-close-popup
          >
            <q-item-section>
              <q-item-label class="text-body2">Opcion 1</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex'
// const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'OrderToolbar',
  data () {
    return {
      header: {}
    }
  }
}
</script>

<style>
</style>
