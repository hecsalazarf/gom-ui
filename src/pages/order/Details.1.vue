<template>
  <q-page class="flex">
    <!-- <div class="column">
      <h1>Detalles</h1>
    </div>-->
    <div class="row full-width justify-center content-start">
      <div class="col-xs-12 col-sm-12 col-md-8 q-pa-xs">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="mails" label="Articulo" />
          <q-tab name="alarms" label="Cliente" />
          <q-tab name="movies" label="Fechas" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated swipeable>
          <q-tab-panel name="mails">
            <div class="text-h6">Articulo</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Cliente</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Fechas</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="accent" icon="edit"/>
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
    },
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      tab: 'mails'
    }
  },
  name: 'PageOrders',
  mounted () {}
}
</script>
