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
          <!-- Fix (#26) -->
          <h-filter-input
            ref="listFilter"
            :disable="selectedOrders.length > 0"
            @filter="filter($event)"
          />
        </q-bar>
        <q-list class="bg-secondary h-rounded-borders-20">
          <h-list-item
            v-for="(order, index) in orders"
            ref="item"
            :key="order.data.id"
            v-model="order.data"
            :separator="index < ordersMaxIndex"
          />
        </q-list>
        <!-- Transition prevents displaying button abruptly -->
        <transition name="fade">
          <q-btn
            v-show="moreOrders"
            icon="expand_more"
            color="accent"
            :label="$t('app.see_more')"
            :loading="loading > 0 && fetchMoreFlag"
            no-caps
            flat
            dense
            rounded
            style="transition-delay: 400ms; transition-duration: 0;"
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
        :to="{ name: $options.routes.newOrder }"
        :aria-label="$t('order.new')"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import UserOrders from 'src/graphql/queries/UserOrders.gql'
import OrderListSub from 'src/graphql/subscriptions/OrderDetails.gql'
import { createNamespacedHelpers } from 'vuex'
import { OrderMixin } from './common'
import { RouteNames } from 'src/constants/app'
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'OrdersListPage',
  components: {
    'h-list-item': () => import('components/order/ListItem.vue'),
    'h-filter-input': () => import('components/order/FilterInput.vue')
  },
  mixins: [ OrderMixin ],
  props: {
  },
  data () {
    return {
      allOrders: [],
      mor: false,
      orders: [],
      refetchFlag: false, // refetch flag. See refresh() method
      fetchMoreFlag: false, // fetchMore flag. See fetchMore() method
      ordersPerBlock: 15,
      loading: 0 // Loading state that will be incremented when the query is loading and decremented when it no longer is
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
      // fetchMore flag that indicates a pagination operation. It prevents
      // loading window during fetchMore. This is a very naive approach, however,
      // as a first attempt is tolerable
      this.fetchMoreFlag = true

      this.$apollo.queries.orders.fetchMore({
        variables: {
          where: {
            ...this.buildQueryVars()
          },
          first: this.ordersPerBlock,
          skip: this.allOrders.length,
          orderBy: 'createdAt_DESC'
        },
        updateQuery: this.updateQuery
      })
        .then(res => {
          this.$refs.listFilter.reset()
          this.fetchMoreFlag = false
        })
        .catch(() => {
          this.fetchMoreFlag = false
        })
    },
    updateQuery (previousResult, { fetchMoreResult, subscriptionData }) {
      if (fetchMoreResult) { // a fetch more operation
        const { ordersConnection: orders } = fetchMoreResult
        this.changeMoreOrders(orders.pageInfo.hasNextPage)
        previousResult.ordersConnection.edges.push(...orders.edges) // push new orders
        previousResult.ordersConnection.pageInfo = orders.pageInfo
      }
      if (subscriptionData && subscriptionData.data.order.mutation === 'CREATED') { // a subscription operation
        previousResult.ordersConnection.edges.unshift({
          __typename: 'OrderEdge',
          node: subscriptionData.data.order.node
        })
        // Updates are not handled as they automatically update the cache by UID
      }

      return previousResult
    },
    refresh (done) {
      // refetch flag that indicates a refetch operation. It prevents
      // loading window during refetch. This is a very naive approach, however,
      // as a first attempt is tolerable
      this.refetchFlag = true
      this.changeMoreOrders(true) // reset more
      this.$apollo.queries.orders.refetch({
        variables: {
          where: {
            ...this.buildQueryVars()
          },
          first: this.ordersPerBlock,
          skip: 0,
          orderBy: 'createdAt_DESC'
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
          !order.data.name.toLowerCase().includes(params.get('term')) && // search in order name
          !order.data.customer.toLowerCase().includes(params.get('term')) // search in custome name
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
          if (typeof data.ordersConnection === 'undefined' || !data.ordersConnection.edges) {
            // If no orders, return an empty array
            return []
          }
          this.allOrders = data.ordersConnection.edges.map(edge => {
            return {
              data: {
                id: edge.node.uid,
                name: edge.node.name,
                customer: `${edge.node.issuedTo.name1} ${edge.node.issuedTo.lastName1 || ''}`, // full name
                createdAt: edge.node.createdAt,
                stage: edge.node.stage
              }
            }
          })
          this.changeMoreOrders(data.ordersConnection.pageInfo.hasNextPage) // flag to display button to load more orders
          return this.allOrders
        },
        watchLoading (isLoading, countModifier) {
          // Loading window is not shown when refetch is executed
          if (isLoading && !this.refetchFlag && !this.fetchMoreFlag) this.$q.loading.show()
          else this.$q.loading.hide()
        },
        loadingKey: 'loading',
        variables: {
          where: {
            ...this.buildQueryVars()
          },
          first: this.ordersPerBlock,
          skip: 0,
          orderBy: 'createdAt_DESC'
        },
        subscribeToMore: {
          document: OrderListSub,
          variables: {
            where: {
              mutation_in: [ 'CREATED', 'UPDATED' ], // subscribe for new and updated orders (Fix #42)
              node: {
                ...this.buildQueryVars()
              }
            }
          },
          // Mutate the previous result
          updateQuery: this.updateQuery
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$can('read', 'orders')) { // check permission
        vm.$router.back() // no permission, go back
      }
    })
  },
  routes: {
    newOrder: RouteNames.ORDER_NEW
  }
}
</script>

<style lang="stylus" scoped>
// Transition fixes issue with button 'More orders' (#41)
.fade-enter-active/* , .fade-leave-active */
  transition: opacity .2s

.fade-enter/* , .fade-leave-to */ /* .fade-leave-active below version 2.1.8 */
  opacity: 0
</style>
