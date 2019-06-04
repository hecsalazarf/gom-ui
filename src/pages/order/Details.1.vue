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
          <q-tab name="items" label="Articulos" />
          <q-tab name="details" label="Detalles" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated swipeable keep-alive>
          <q-tab-panel name="items" class=" q-gutter-y-md">
            <h-order-item/>
            <h-order-item/>
          </q-tab-panel>

          <q-tab-panel name="details">
            <h-order-details-tab/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="accent" icon="edit"/>
    </q-page-sticky> -->
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
      tab: 'items'
    }
  },
  name: 'PageOrders',
  components: {
    'h-order-item': () => import('components/order/Item.vue'),
    'h-order-details-tab': () => import('components/order/DetailsTab.vue')
  },
  mounted () {}
}
</script>
