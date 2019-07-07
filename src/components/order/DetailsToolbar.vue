<template>
  <q-toolbar>
    <q-btn
      class="q-mr-sm"
      icon="arrow_back_ios"
      flat
      dense
      @click="$router.back()"
    />
    <div
      v-if="!activeOrder"
      class="col-5 text-subtitle1"
    >
      Nuevo pedido
    </div>
    <q-avatar
      v-if="activeOrder"
      rounded
      size="2.5em"
      :icon="stage.icon"
      color="accent"
      text-color="white"
    >
      <q-badge
        floating
        color="teal"
      >
        {{ stage.label }}
      </q-badge>
    </q-avatar>
    <div
      v-if="activeOrder"
      class="column self-stretch q-ml-md items-start justify-start content-start ellipsis"
    >
      <div class="col-5 text-subtitle1">
        {{ header.name }}
      </div>
      <div class="col text-subtitle2 text-weight-regular">
        {{ customer }}
      </div>
    </div>
    <q-space />
    <!-- <q-btn
      v-if="activeOrder"
      flat
      dense
      icon="more_horiz"
    > -->
    <!-- no-refocus to prevent input to lose focus in NewItemComponent -->
    <!-- <q-menu no-refocus>
        <q-list>
          <q-item
            v-if="activeOrderTab === 'items'"
            v-close-popup
            clickable
            @click="emitEvent({target: 'HOrderDetails', method: 'addItem'})"
          >
            <q-item-section class="text-body2">
              Agregar artículo
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn> -->
  </q-toolbar>
</template>

<script>
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'OrderToolbar',
  data () {
    return {
      header: {}
    }
  },
  computed: {
    stage () {
      let stage
      switch (this.header.stage) {
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
      if (this.header.customer) {
        const name1 = this.header.customer.name1
          ? this.header.customer.name1
          : ''
        const name2 = this.header.customer.name2
          ? this.header.customer.name2
          : ''
        const lastName1 = this.header.customer.lastName1
          ? this.header.customer.lastName1
          : ''
        const lastName2 = this.header.customer.lastName2
          ? this.header.customer.lastName2
          : ''
        name = `${name1} ${name2} ${lastName1} ${lastName2}`.replace(
          /\s+/g,
          ' '
        )
      } else {
        name = ''
      }

      return name
    },
    ...mapGetters(['activeOrder', 'activeOrderTab'])
  },
  created () {
    if (this.activeOrder) {
      this.$apollo
        .watchQuery({
          query: OrderDetails,
          variables: {
            id: this.activeOrder
          }
        })
        .subscribe(this.updateHeader)
    }
  },
  methods: {
    updateHeader ({ data: { order } }) {
      this.header = (({ name, stage, issuedTo }) => ({
        name,
        stage,
        customer: issuedTo.edges[0].node
      }))(order)
    },
    ...mapActions(['emitEvent'])
  }
}
</script>

<style>
</style>
