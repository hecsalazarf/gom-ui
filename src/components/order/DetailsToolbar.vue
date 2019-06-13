<template>
  <q-toolbar>
    <q-btn class="q-mr-sm" icon="arrow_back_ios" flat dense @click="$router.back()"/>
     <q-avatar
      rounded
      size="2.5em"
      :icon="stage.icon"
      color="accent"
      text-color="white"
    >
      <q-badge floating color="teal">{{stage.label}}</q-badge>
    </q-avatar>
    <div class="column self-stretch q-ml-md items-start justify-start content-start">
      <div class="col-5 text-subtitle1">{{order.name}}</div>
      <div class="col text-subtitle2 text-weight-regular">{{customer}}</div>
    </div>
    <q-space />
    <q-btn flat dense icon="more_horiz">
      <q-menu>
        <q-list>
          <q-item clickable v-close-popup v-if="activeOrderTab === 'items'" @click="emitEvent({target: 'HOrderDetails', method: 'addItem'})">
            <q-item-section class="text-body2">Agregar artículo</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script>
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'OrderToolbar',
  data () {
    return {}
  },
  methods: {
    ...mapActions([
      'emitEvent'
    ])
  },
  computed: {
    order () {
      try {
        const { order } = this.$apollo.getClient().readQuery({
          query: OrderDetails,
          variables: {
            id: this.activeOrder
          }
        })
        return {
          name: order.name,
          stage: order.stage,
          customer: order.issuedTo.edges[0].node
        }
      } catch (err) {
        return {}
      }
    },
    stage () {
      let stage
      switch (this.order.stage) {
        case 'WON':
          stage = { label: 'Entregado', value: 'WON', icon: 'check' }
          break
        case 'OPEN':
          stage = { label: 'Nuevo', icon: 'input' }
          break
        case 'CLOSED':
          stage = { label: 'Cancelado', icon: 'cancel_presentation' }
          break
        default:
          stage = { label: '', icon: '' }
      }
      return stage
    },
    customer () {
      let name
      if (this.order.customer) {
        const name1 = this.order.customer.name1 ? this.order.customer.name1 : ''
        const name2 = this.order.customer.name2 ? this.order.customer.name2 : ''
        const lastName1 = this.order.customer.lastName1 ? this.order.customer.lastName1 : ''
        const lastName2 = this.order.customer.lastName2 ? this.order.customer.lastName2 : ''
        name = `${name1} ${name2} ${lastName1} ${lastName2}`.replace(/\s+/g, ' ')
      } else {
        name = ''
      }

      return name
    },
    ...mapGetters([
      'activeOrder',
      'activeOrderTab'
    ])
  }
}
</script>

<style>
</style>
