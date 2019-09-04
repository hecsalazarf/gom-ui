<template>
  <q-page
    padding
    class="flex"
  >
    <q-pull-to-refresh
      class="full-width"
      @refresh="refresh"
    >
      <div class="row full-width justify-center content-start">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab
              name="details"
              :label="$t('order.details')"
            />
            <q-tab
              name="items"
              :label="$tc('item.label', 2)"
            />
          </q-tabs>
          <q-separator />
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            keep-alive
          >
            <q-tab-panel name="details">
              <h-order-details-tab
                :value="order"
                :readonly="readonly"
              />
            </q-tab-panel>

            <q-tab-panel
              name="items"
              class="q-gutter-y-sm"
            >
              <!-- Item is readonly if satifies rule readonly-order -->
              <!-- Item cannot be removed (no-removable) if it's the last one -->
              <h-order-item
                v-for="(item) in order.items"
                :key="item.data.id"
                v-model="item.data"
                :readonly="readonly"
                :no-removable="order.items.length === 1"
              />
              <!-- CASL permission. ONLY SELLER ROLE -->
              <can
                do="role"
                on="seller"
              >
                <q-btn
                  v-if="!readonly"
                  icon="add"
                  :label="$t('item.add_item')"
                  color="accent"
                  class="full-width"
                  rounded
                  dense
                  outline
                  no-caps
                  @click="$refs.newItem.show()"
                />
              </can>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </q-pull-to-refresh>
    <q-dialog
      ref="newItem"
      persistent
      full-width
      position="top"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <h-new-item
        @reset="$refs.newItem.hide()"
        @done="$refs.newItem.hide()"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import OrderDetailsSub from 'src/graphql/subscriptions/OrderDetails.gql'
import { Engine } from 'json-rules-engine'
import { EditableOrder } from 'src/rules/order'
import { createNamespacedHelpers } from 'vuex'
import { OrderMixin } from './common'
const { mapActions, mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'HOrderDetails',
  components: {
    'h-order-item': () => import('components/order/Item.vue'),
    'h-order-details-tab': () => import('components/order/DetailsTab.vue'),
    'h-new-item': () => import('components/order/NewItem.vue')
  },
  mixins: [ OrderMixin ],
  props: {
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      rulesEngine: new Engine([EditableOrder], { allowUndefinedFacts: true }), // JSON rules engine
      readonly: true,
      tab: 'details',
      order: {
        items: [] // initialize items to avoid undefined errors
      }
    }
  },
  computed: {
    ...mapGetters(['event'])
  },
  watch: {
    'order.stage' (val) {
      /* Check if order is readonly */
      this.rulesEngine.run({
        status: val,
        isCustomer: this.$can('role', 'customer')
      }).then(events => {
        if (events.findIndex(event => event.type === 'readonly-order') > -1) {
          this.readonly = true // Mark order as readonly
        } else {
          this.readonly = false // Order can be edited
        }
      })
    }
  },
  created () {
    this.changeActiveOrder(this.id)
    this.changeActiveToolbar('h-order-toolbar')
    this.changeActiveOrderTab(this.tab)
  },
  methods: {
    refresh (done) {
      this.$apollo.queries.order.refetch({
        variables: {
          where: {
            uid: this.id
          }
        }
      })
        .finally(() => done())
    },
    ...mapActions([
      'changeActiveOrder',
      'changeActiveToolbar',
      'changeActiveOrderTab'
    ])
  },
  apollo: {
    order () {
      return {
        query: OrderDetails,
        update (data) {
          if (typeof data.order === 'undefined') {
            // this might happen when an error ocurred
            return this.order // return previous state (or initial state)
          }
          if (!data.order) {
            this.$router.back() // record does not exist, we receive null
            return this.order
          }

          const items = data.order.items.map(item => {
            return {
              data: {
                id: item.uid,
                code: item.code,
                description: item.description,
                provider: item.provider,
                quantity: item.quantity,
                price: item.pricing[0]
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
            customer: data.order.issuedTo
          }
        },
        watchLoading (isLoading, countModifier) {
          if (isLoading) this.$q.loading.show()
          else this.$q.loading.hide()
        },
        variables: {
          where: {
            uid: this.id
          }
        },
        subscribeToMore: {
          document: OrderDetailsSub,
          variables: {
            where: {
              node: {
                uid: this.id, // subscribe for new and updated orders (Fix #42)
                ...this.buildQueryVars()
              }
            }
          }
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$can('read', 'order')) { // check permission
        vm.$router.back() // no permission, go back
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    this.changeActiveToolbar(null)
    this.changeActiveOrder(null)
    next()
  }
}
</script>

<style scoped lang="stylus">
.q-tab-panel {
  padding-top: 16px;
  padding-right: 0px;
  padding-bottom: 16px;
  padding-left: 0px;
}
</style>
