<template>
  <q-page padding>
    <div class="row justify-center">
      <q-stepper
        ref="stepper"
        v-model="step"
        class="col-xs-12 col-sm-12 col-md-8"
        color="primary"
        active-color="accent"
        animated
        keep-alive
        flat
        done-color="teal"
        :contracted="$q.screen.lt.md"
      >
        <q-step
          :name="1"
          :title="$tc('item.label', 1)"
          :caption="$t('order.step1_desc')"
          icon="shop"
          active-icon="shop"
          :done="step > 1"
          class="q-pb-sm"
        >
          <h-order-item
            v-for="(item, index) in order.items"
            :key="index"
            class="q-mb-sm"
            no-mutations
            :value="item.data"
            @delete="order.items.splice(index, 1)"
            @change="order.items.splice(index, 1, { data: $event })"
            @edit-mode="$event ? editCounter++ : editCounter--"
          />
          <q-btn
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
        </q-step>

        <q-step
          :name="2"
          :title="$tc('customer.label', 1)"
          :caption="$t('order.step2_desc')"
          icon="assignment_ind"
          active-icon="assignment_ind"
          :done="step > 2"
        >
          <div class="bg-secondary q-pa-sm q-mt-xs h-rounded-borders-20">
            <q-form
              ref="form2"
              class="q-gutter-y-sm"
            >
              <!-- Order name -->
              <q-input
                v-model="order.name"
                :label="$t('order.description')"
                standout
                dense
                input-class="text-black"
                hide-bottom-space
                :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
              >
                <template v-slot:prepend>
                  <q-icon name="notes" />
                </template>
              </q-input>
              <!-- Customer search -->
              <h-customer-search @input="order.customer = $event" />
            </q-form>
          </div>
        </q-step>

        <q-step
          :name="3"
          :title="$t('app.confirm')"
          :caption="$t('order.step3_desc')"
          icon="shopping_basket"
          active-icon="shopping_basket"
        >
          <h-order-summary :value="order" />
        </q-step>
        <template
          v-if="$q.screen.lt.md"
          v-slot:message
        >
          <div
            class="text-subtitle2 bg-secondary text-primary q-mb-md q-pl-lg q-pr-lg h-rounded-borders-20"
          >
            {{ caption }}
          </div>
        </template>
        <template v-slot:navigation>
          <q-stepper-navigation class="float-right q-mt-md q-gutter-x-md">
            <q-btn
              v-if="step > 1"
              color="primary"
              icon="arrow_back"
              size="lg"
              dense
              round
              flat
              @click="$refs.stepper.previous()"
            />
            <q-btn
              v-if="step < 3"
              color="primary"
              icon="arrow_forward"
              size="lg"
              dense
              round
              flat
              @click="nextStep()"
            />
            <q-btn
              v-if="step === 3"
              color="teal"
              icon="send"
              size="lg"
              dense
              round
              flat
              @click="submit()"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
      <q-dialog
        ref="newItem"
        persistent
        :position="$q.platform.is.mobile ? 'bottom' : 'standard'"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <h-new-item
          no-mutations
          @reset="$refs.newItem.hide()"
          @submit="addItem($event)"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import CreateOrder from 'src/graphql/mutations/CreateOrder.gql'
import UserOrders from 'src/graphql/queries/UserOrders.gql'
import { throttle } from 'quasar'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'NewOrderPage',
  components: {
    'h-order-item': () => import('components/order/Item.vue'),
    'h-customer-search': () => import('components/customer/SearchInput.vue'),
    'h-order-summary': () => import('components/order/SummaryCard.vue'),
    'h-new-item': () => import('components/order/NewItem.vue')
  },
  data () {
    return {
      step: 1,
      editCounter: 0, // counter that handles items being modified
      submitted: false, // flag to identify when order was submitted
      order: {
        name: '',
        customer: null,
        items: []
      }
    }
  },
  computed: {
    caption () {
      let caption
      switch (this.step) {
        case 1:
          caption = this.$t('order.step1_desc')
          break
        case 2:
          caption = this.$t('order.step2_desc')
          break
        case 3:
          caption = this.$t('order.step3_desc')
          break
      }
      return caption
    }
  },
  created () {
    this.changeActiveToolbar('h-order-toolbar')
  },
  methods: {
    queryOrders () {
      this.$apollo.query({
        query: UserOrders,
        variables: {
          where: {
            assignedTo: {
              extUid: this.$user.id
            }
          },
          first: 1, // As it is empty, only the first order
          skip: 0, // First call does not skip orders
          orderBy: 'createdAt_DESC'
        },
        fetchPolicy: 'network-only' // Bypass cache in case query has been fetched before
      }).then(res => {
        // Nothing to do
      })
    },
    updateCache (cache, { data }) {
      try {
        const cached = cache.readQuery({
          query: UserOrders,
          variables: {
            where: {
              assignedTo: {
                extUid: this.$user.id
              }
            }
          }
        })

        if (!cached.ordersConnection.edges.length === 0) {
          /* If cache is empty but query has been executed,
          fetch orders to update cache
          for the first time (#18) */
          this.queryOrders()
          return
        }

        cached.ordersConnection.edges.unshift({
          __typename: 'OrderEdge',
          node: data.createOrder
        })

        // Update orders cache
        cache.writeQuery({
          query: UserOrders,
          variables: {
            where: {
              assignedTo: {
                extUid: this.$user.id
              }
            }
          },
          data: cached
        })
      } catch (err) {
        console.error(err)
      }
    },
    submit () {
      let data = {
        name: this.order.name,
        assignedTo: {
          connect: {
            extUid: this.$user.id
          }
        },
        issuedTo: {
          connect: {
            uid: this.order.customer.value
          }
        },
        items: {
          create: this.order.items.map(item => {
            return {
              code: item.data.code !== '' ? item.data.code : undefined,
              quantity: item.data.quantity,
              provider: item.data.provider !== '' ? item.data.provider : undefined,
              description: item.data.description,
              pricing: {
                create: {
                  amount: item.data.price.amount,
                  currency: item.data.price.currency
                }
              }
            }
          })
        }
      }
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: CreateOrder,
        variables: { data },
        update: this.updateCache
      }).then(res => {
        this.submitted = true
        this.$q.loading.hide()
        this.$router.replace({ name: 'orderDetails', params: { id: res.data.createOrder.uid } })
      })
    },
    addItem (item) {
      this.order.items.push({
        data: item
      })
      this.$refs.newItem.hide()
    },
    notify: throttle(function (options) {
      this.$q.notify(options)
    }, 3000),
    nextStep: throttle(function () {
      switch (this.step) {
        case 1:
          // Continue to next step only if there's at least one item and no item is being edited
          if (this.order.items.length > 0 && this.editCounter === 0) this.$refs.stepper.next()
          else {
            this.notify({
              color: 'negative',
              message: this.editCounter > 0 ? 'Finalice las modificaciones pendientes' : 'Agrega al menos un artículo',
              icon: 'report_problem'
            })
          }
          break
        case 2:
          this.$refs.form2.validate(true).then(out => {
            if (out) this.$refs.stepper.next()
            else {
              this.notify({
                color: 'negative',
                message: 'Completa los campos',
                icon: 'report_problem'
              })
            }
          })
          break
      }
    }, 500),
    ...mapActions(['changeActiveToolbar'])
  },
  beforeRouteLeave (to, from, next) {
    // Emit a dialog if an order is in process and has not been submitted (#19)
    if (this.order.items.length > 0 && !this.submitted) {
      this.$q.dialog({
        title: this.$t('order.confirm_exit_title'),
        message: this.$t('order.confirm_exit_message'),
        position: 'bottom',
        persistent: true,
        cancel: {
          label: this.$t('app.no'),
          color: 'primary',
          flat: true
        },
        ok: {
          label: this.$t('app.yes'),
          color: 'primary',
          flat: true
        },
        stackButtons: false,
        color: 'primary'
      }).onOk(() => {
        this.changeActiveToolbar(null)
        next()
      }).onCancel(() => next(false))
      return
    }

    this.changeActiveToolbar(null)
    next()
  }
}
</script>

<style scoped lang="stylus">
/deep/ .q-stepper__tab {
  padding: 0px;
}

/deep/ .q-stepper--horizontal .q-stepper__step-inner {
  padding: 0px;
}

.q-stepper--horizontal > .q-stepper__nav {
  padding: 0px;
}
</style>
