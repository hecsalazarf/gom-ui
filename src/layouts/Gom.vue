<template>
  <q-layout view="lhh lpr lFf">
    <q-header reveal :reveal-offset="100">
      <transition mode="out-in" leave-active-class="animated fadeOut">
        <component
          :is="activeToolbar"
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
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'GomLayout',
  components: {
    'h-main-toolbar': () => import('components/MainToolbar.vue'),
    'h-selection-toolbar': () => import('components/order/SelectionToolbar.vue'),
    'h-order-toolbar': () => import('components/order/DetailsToolbar.vue'),
    'h-customer-toolbar': () => import('components/customer/DetailsToolbar.vue')
  },
  data () {
    return {
      tab: 'orders'
    }
  },
  methods: {
    openURL,
    ...mapActions([
      'changeActiveToolbar'
    ])
  },
  computed: {
    ...mapGetters([
      'activeToolbar'
    ])
  },
  created () {
    this.changeActiveToolbar('h-main-toolbar')
  }
}
</script>

<style>
</style>
