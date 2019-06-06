<template>
  <q-page class="flex">
    <q-pull-to-refresh @refresh="refresh" class="full-width">
      <q-bar class="q-pa-lg bg-white">
        <h-filter-input @filter="filter($event)" :disable="selectionMode"/>
      </q-bar>
      <q-list>
        <h-list-item
          ref="item"
          v-for="(order, index) in orders"
          :key="order.id"
          v-model="order.data"
          :separator="index < ordersMaxIndex"
          :selected="selected"
          @selected="selected = $event"
          :selection="selectionMode"
          @selection="activateSel()"
        />
      </q-list>
    </q-pull-to-refresh>
  </q-page>
</template>

<style>
</style>

<script>
import QueryUserOrders from 'src/graphql/queries/UserOrders.gql'
import { Auth } from 'src/helpers'
import { QSpinnerBars } from 'quasar'

export default {
  props: {
    tk: {
      type: String,
      default: ''
    }
  },
  components: {
    'h-list-item': () => import('components/order/ListItem.vue'),
    'h-filter-input': () => import('components/order/FilterInput.vue')
  },
  name: 'OrdersListPage',
  data () {
    return {
      allOrders: [],
      selected: [],
      selectionMode: false,
      orders: {}
    }
  },
  created () {
  },
  methods: {
    refresh (done) {
      this.$apollo.queries.orders.refetch({
        variables: {
          id: Auth.userId
        }
      }).then(() => done())
        .catch(() => done())

      // FOLLOWING CODE USED FOR PAGINATION
      /* this.$apollo.queries.orders.fetchMore({
        variables: {
          id: Auth.userId
        },
        updateQuery (previousResult, { fetchMoreResult }) {
          previousResult.user.orders.edges.unshift(...fetchMoreResult.user.orders.edges)
          return {
            user: {
              __typename: previousResult.user.__typename,
              orders: previousResult.user.orders,
              uid: fetchMoreResult.user.uid
            }
          }
        }
      }) */
    },
    filter (params) {
      this.orders = this.allOrders.filter(order => {
        if (
          params.has('status') &&
          !params.get('status').includes(order.data.stage)
        ) {
          return false
        }
        if (
          params.has('term') &&
          !order.data.name.toLowerCase().includes(params.get('term'))
        ) {
          return false
        }
        return true
      })
    },
    activateSel () {
      this.selectionMode = true
      this.$emit('toolbar', true)
    },
    selectAll () {
      this.selected = this.orders.map(order => {
        return order.data.id
      })
    },
    unselectAll () {
      this.selected = []
    }
  },
  computed: {
    ordersMaxIndex () {
      return this.orders.length - 1
    }
  },
  watch: {
    selected (value) {
      if (value.length === 0) {
        this.selectionMode = false
        this.$emit('toolbar', false)
      } else {
        this.$emit('selected', {
          max: this.ordersMaxIndex + 1,
          count: value.length
        })
      }
    }
  },
  apollo: {
    orders () {
      return {
        query: QueryUserOrders,
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
            return []
          }
          this.allOrders = data.user.orders.edges.map(edge => {
            return {
              data: {
                id: edge.node.uid,
                name: edge.node.name,
                customer: edge.node.issuedTo.edges[0].node.name1,
                createdAt: edge.node.createdAt,
                stage: edge.node.stage
              }
            }
          })
          return this.allOrders
        },
        watchLoading (isLoading, countModifier) {
          if (isLoading) this.$q.loading.show({ spinner: QSpinnerBars })
          else this.$q.loading.hide()
        },
        variables () {
          return {
            id: Auth.userId
          }
        }
      }
    }
  }
}
</script>
