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
            <h-order-item v-for="(item) in order.items" :key="item.id" v-model="item.data"/>
          </q-tab-panel>

          <q-tab-panel name="details">
            <h-order-details-tab v-model="order"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <h-new-item ref="newItem" v-if="newItem"/>
  </q-page>
</template>

<style>
</style>

<script>
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import { QSpinnerBars } from 'quasar'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'HOrderDetails',
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
      order: {
        items: [] // initialize items to avoid undefined errors
      },
      newItem: false
    }
  },
  components: {
    'h-order-item': () => import('components/order/Item.vue'),
    'h-order-details-tab': () => import('components/order/DetailsTab.vue'),
    'h-new-item': () => import('components/order/NewItem.vue')
  },
  methods: {
    save () {
    },
    cancel () {
      console.log()
    },
    addItem () {
      this.$refs.newItem.show()
      console.log('addItem')
    },
    ...mapActions([
      'changeActiveOrder',
      'changeActiveToolbar',
      'changeActiveOrderTab'
    ])
  },
  created () {
    /* this.$store.subscribeAction((action, state) => {
      if (action.type === 'GomState/emitEvent' &&
      action.payload.target === this.$options.name &&
      this[action.payload.method]
      ) {
        this[action.payload.method](action.payload.args)
      }
    }) */
    this.changeActiveOrder(this.id)
    this.changeActiveToolbar('h-order-toolbar')
    this.changeActiveOrderTab(this.tab)
    setTimeout(() => { this.newItem = !this.newItem }, 500)
  },
  watch: {
    tab (newVal, oldVal) {
      this.changeActiveOrderTab(newVal)
    },
    event (evt) {
      if (evt.target === this.$options.name && this[evt.method]) this[evt.method](evt.args)
    }
  },
  computed: {
    ...mapGetters([
      'event'
    ])
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
          if (Object.entries(data).length === 0) {
            return {}
          }
          const items = data.order.items.edges.map(edge => {
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
            items,
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
  },
  beforeRouteLeave (to, from, next) {
    this.changeActiveToolbar(null)
    next()
  }
}
</script>
