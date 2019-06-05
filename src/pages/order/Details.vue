<template>
  <q-page class="flex">
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
          <q-tab name="items" label="Articulos"/>
          <q-tab name="details" label="Detalles"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated swipeable keep-alive>
          <q-tab-panel name="items" class="q-gutter-y-md">
            <h-order-item v-for="(item) in items" :key="item.id" v-model="item.data"/>
          </q-tab-panel>

          <q-tab-panel name="details">
            <h-order-details-tab v-model="order"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import { QSpinnerBars } from 'quasar'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')
// this.$store.dispatch('GomState/changeActiveOrder', '23')
export default {
  props: {
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      tab: 'items',
      items: []
    }
  },
  name: 'PageOrders',
  components: {
    'h-order-item': () => import('components/order/Item.vue'),
    'h-order-details-tab': () => import('components/order/DetailsTab.vue')
  },
  methods: {
    ...mapActions([
      'changeActiveOrder'
    ])
  },
  created () {
  },
  apollo: {
    order () {
      return {
        query: OrderDetails,
        error: err => {
          console.log(err)
        },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        update (data) {
          this.changeActiveOrder(data.order.uid)
          this.items = data.order.items.edges.map(edge => {
            return {
              data: {
                id: edge.node.uid,
                code: edge.node.code,
                description: edge.node.description,
                provider: edge.node.provider,
                quantity: edge.node.quantity,
                price: edge.node.pricing.edges[0].node.amount
              }
            }
          })

          return {
            id: data.order.uid,
            items: this.items,
            stage: data.order.stage,
            name: data.order.name,
            createdAt: data.order.createdAt,
            updatedAt: data.order.updatedAt,
            customer: data.order.issuedTo.edges[0].node
          }
        },
        watchLoading (isLoading, countModifier) {
          if (isLoading) this.$q.loading.show({ spinner: QSpinnerBars })
          else this.$q.loading.hide()
        },
        variables () {
          return {
            id: this.id
          }
        }
      }
    }
  }
}
</script>
