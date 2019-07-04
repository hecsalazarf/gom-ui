<template>
  <q-page
    class="flex"
    padding
  >
    <q-pull-to-refresh
      class="full-width"
      @refresh="refresh"
    >
      <q-bar class="bg-white q-mb-lg">
        <h-filter-input
          :disable="selectedOrders.length > 0"
          @filter="filter($event)"
        />
      </q-bar>
      <q-list class="bg-blue-1 h-rounded-borders-20">
        <h-list-item
          v-for="(order, index) in orders"
          ref="item"
          :key="order.id"
          v-model="order.data"
          :separator="index < ordersMaxIndex"
        />
      </q-list>
    </q-pull-to-refresh>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        round
        color="accent"
        icon="add_shopping_cart"
        class="shadow-7"
        :to="{ name: 'newOrder' }"
      />
    </q-page-sticky>
  </q-page>
</template>

<style>
</style>

<script>
import UserOrders from 'src/graphql/queries/UserOrders.gql'
import { Auth } from 'src/helpers'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'OrdersListPage',
  components: {
    'h-list-item': () => import('components/order/ListItem.vue'),
    'h-filter-input': () => import('components/order/FilterInput.vue')
  },
  props: {
  },
  data () {
    return {
      allOrders: [],
      orders: {}
    }
  },
  computed: {
    ordersMaxIndex () {
      return this.orders.length - 1
    },
    ...mapGetters([
      'selectedOrders'
    ])
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
    }
  },
  apollo: {
    orders () {
      return {
        query: UserOrders,
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
          if (isLoading) this.$q.loading.show()
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
