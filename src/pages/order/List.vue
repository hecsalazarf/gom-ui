<template>
  <q-page
    class="flex"
    padding
  >
    <q-pull-to-refresh
      class="full-width"
      @refresh="refresh"
    >
      <div class="column q-gutter-y-md">
        <q-bar class="bg-white">
          <h-filter-input
            :disable="selectedOrders.length > 0 || orders.length === 0"
            @filter="filter($event)"
          />
        </q-bar>
        <q-list class="bg-secondary h-rounded-borders-20">
          <h-list-item
            v-for="(order, index) in orders"
            ref="item"
            :key="order.id"
            v-model="order.data"
            :separator="index < ordersMaxIndex"
          />
        </q-list>
        <!-- Transition prevents displaying button abruptly -->
        <transition
          mode="out-in"
          enter-active-class="animated fadeIn"
        >
          <q-btn
            v-show="allOrders.length > 0 && moreOrders"
            icon="expand_more"
            color="accent"
            label="Ver más"
            :loading="loading > 0 && fetchMoreFlag"
            no-caps
            flat
            dense
            rounded
            style="animation-duration: 3000ms;"
            @click="fetchMore()"
          >
            <template v-slot:loading>
              <q-spinner-bars />
            </template>
          </q-btn>
        </transition>
      </div>
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
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

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
      orders: [],
      refetchFlag: false, // refetch flag. See refresh() method
      fetchMoreFlag: false, // fetchMore flag. See fetchMore() method
      ordersPerBlock: 15,
      loading: 0 // Loading state that will be incremented when the query is loading and decremented when it no longer is,
    }
  },
  computed: {
    ordersMaxIndex () {
      return this.orders.length - 1
    },
    ...mapGetters([
      'selectedOrders',
      'moreOrders'
    ])
  },
  methods: {
    fetchMore () {
      /* fetchMore flag that indicates a pagination operation. It prevents
      loading window during fetchMore. This is a very naive approach, however,
      as a first attempt is tolerable */
      this.fetchMoreFlag = true

      this.$apollo.queries.orders.fetchMore({
        variables: {
          id: Auth.userId,
          first: this.ordersPerBlock,
          offset: this.allOrders.length
        },
        updateQuery: this.updateQuery
      })
        .then(res => {
          this.fetchMoreFlag = false
        })
        .catch(() => {
          this.fetchMoreFlag = false
        })
    },
    updateQuery (previousResult, { fetchMoreResult, variables }) {
      if (!fetchMoreResult.user.orders.edges) {
        /* If orders is null return the same cache and set more to false */
        this.changeMoreOrders(false)
        return {
          user: previousResult.user
        }
      }
      if (fetchMoreResult.user.orders.edges.length < this.ordersPerBlock) {
        /* If the orders length is less than ordersPerBlock, it means it's the
            last block, so more is set to false */
        this.changeMoreOrders(false)
      }
      previousResult.user.orders.edges.push(...fetchMoreResult.user.orders.edges)
      return {
        user: {
          __typename: previousResult.user.__typename,
          orders: previousResult.user.orders,
          uid: fetchMoreResult.user.uid
        }
      }
    },
    refresh (done) {
      /* refetch flag that indicates a refetch operation. It prevents
      loading window during refetch. This is a very naive approach, however,
      as a first attempt is tolerable */
      this.refetchFlag = true
      this.changeMoreOrders(true) // reset more
      this.$apollo.queries.orders.refetch({
        variables: {
          id: Auth.userId,
          first: this.ordersPerBlock,
          offset: 0 // First call does not skip orders
        }
      }).then(() => {
        this.refetchFlag = false
        done()
      })
        .catch(() => {
          this.refetchFlag = false
          done()
        })
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
    ...mapActions(['changeMoreOrders'])
  },
  apollo: {
    orders () {
      return {
        query: UserOrders,
        /*
        Context can also be set per request
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        */
        update (data) {
          if (typeof data.user === 'undefined' || !data.user.orders.edges) {
            // If no orders, return an empty array
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
          /* Loading window is not shown when refetch is executed */
          if (isLoading && !this.refetchFlag && !this.fetchMoreFlag) this.$q.loading.show()
          else this.$q.loading.hide()
        },
        loadingKey: 'loading',
        variables () {
          return {
            id: Auth.userId,
            first: this.ordersPerBlock,
            offset: 0 // First call does not skip orders
          }
        }
      }
    }
  }
}
</script>
