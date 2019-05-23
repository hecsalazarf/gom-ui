<template>
  <q-layout view="lhh lpr lFf">
    <q-header reveal :reveal-offset="100">
      <transition mode="out-in" leave-active-class="animated fadeOut">
        <component
          :is="toolbar"
          v-bind="toolbarProps"
          @action="dispatchToolbarEvent($event)"
        />
      </transition>
    </q-header>
    <q-footer>
      <q-tabs dense no-caps v-model="tab" active-color="white">
        <q-route-tab name="orders" :to="{ name: 'orders' }" label="Pedidos" icon="shopping_cart"/>
        <q-route-tab name="customers" :to="{ name: 'customers' }" label="Clientes" icon="contacts"/>
      </q-tabs>
    </q-footer>
    <q-page-container>
      <router-view ref="view" @dispatch="dispatchViewEvent($event)"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
const MAIN_TOOLBAR = 'h-main-toolbar'
const ORDER_TOOLBAR = 'h-order-toolbar'

export default {
  name: 'GomLayout',
  components: {
    'h-main-toolbar': () => import('components/MainToolbar.vue'),
    'h-selection-toolbar': () => import('components/order/SelectionToolbar.vue'),
    'h-order-toolbar': () => import('components/order/DetailsToolbar.vue')
  },
  data () {
    return {
      tab: 'orders',
      toolbar: MAIN_TOOLBAR,
      toolbarProps: {}
    }
  },
  methods: {
    openURL,
    changeToolbar (toolbar) {
      this.toolbar = toolbar.show ? toolbar.name : MAIN_TOOLBAR
    },
    setToolbarProps (toolbar) {
      if (toolbar.name === this.toolbar) { // ensure the active toolbar
        this.toolbarProps = toolbar.props
      }
    },
    dispatchToolbarEvent (evt) {
      this.$refs.view.dispatch(evt)
    },
    dispatchViewEvent ({ method, params }) {
      this[method](params)
    }
  },
  computed: {
  },
  watch: {
    $route (route) {
      switch (route.name) {
        case 'orderDetails':
          this.toolbar = ORDER_TOOLBAR
          break
        default:
          this.toolbar = MAIN_TOOLBAR
          break
      }
    }
  }
}
</script>

<style>
</style>
