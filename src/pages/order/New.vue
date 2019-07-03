<template>
  <q-page padding>
    <div class="row justify-center">
      <q-stepper
        ref="stepper"
        v-model="step"
        class="col-xs-12 col-sm-12 col-md-8"
        color="primary"
        animated
        keep-alive
        flat
        done-color="teal"
        :contracted="$q.screen.lt.md"
      >
        <q-step
          :name="1"
          title="Artículos"
          caption="Agrega los artículos a tu pedido"
          icon="shopping_basket"
          active-icon="shopping_basket"
          :done="step > 1"
          class="q-pb-sm"
        >
          <h-order-item
            v-for="(item, index) in order.items"
            :key="index"
            class="q-mb-sm"
            readonly
            :value="item.data"
            @delete="order.items.splice(index, 1)"
            @change="order.items.splice(index, 1, { data: $event })"
            @edit-mode="$event ? editCounter++ : editCounter--"
          />
          <q-btn
            icon="add"
            label="Agregar artículo"
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
          title="Cliente"
          caption="Agrega una descripción y selecciona un cliente"
          icon="more"
          active-icon="more"
          :done="step > 2"
        >
          <div class="bg-blue-1 q-pa-sm q-mt-xs h-rounded-borders-20">
            <q-form
              ref="form2"
              class="q-gutter-y-sm"
            >
              <!-- Order name -->
              <q-input
                v-model="order.name"
                label="Descripción"
                standout
                dense
                input-class="text-black"
                hide-bottom-space
                :rules="[ val => !!val || 'Campo obligatorio', val => val.length <= 40 || 'Máximo 40 caracteres' ]"
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
          title="Confirmación"
          caption="Confirma y envía tu pedido"
          icon="rate_review"
          active-icon="rate_review"
        >
          <h-order-summary :value="order" />
        </q-step>
        <template
          v-if="$q.screen.lt.md"
          v-slot:message
        >
          <div
            class="text-subtitle2 bg-blue-1 text-primary q-mb-md q-pl-lg q-pr-lg h-rounded-borders-20"
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
          readonly
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
import { Auth } from 'src/helpers'
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
          caption = 'Agrega los artículos a tu pedido'
          break
        case 2:
          caption = 'Agrega una descripción y selecciona un cliente'
          break
        case 3:
          caption = 'Confirma y envía tu pedido'
          break
      }
      return caption
    }
  },
  created () {
    this.changeActiveToolbar('h-order-toolbar')
  },
  methods: {
    updateCache (cache, { data }) {
      try {
        const cached = cache.readQuery({
          query: UserOrders,
          variables: {
            id: Auth.userId
          }
        })
        cached.user.orders.edges.unshift({
          __typename: 'UserToOrderEdge',
          node: data.createOrder
        })

        // Update orders cache
        cache.writeQuery({
          query: UserOrders,
          variables: {
            id: Auth.userId
          },
          data: cached
        })
      } catch (err) {
        console.err(err)
      }
    },
    submit () {
      let data = {
        name: this.order.name,
        stage: 'OPEN',
        edges: {
          assignedTo: {
            target: Auth.userId
          },
          issuedTo: {
            target: this.order.customer.value
          }
        }
      }
      data.edges.items = this.order.items.map(item => {
        return {
          node: {
            code: item.data.code !== '' ? item.data.code : undefined,
            quantity: item.data.quantity,
            provider: item.data.provider !== '' ? item.data.provider : undefined,
            description: item.data.description,
            edges: {
              pricing: {
                node: {
                  amount: item.data.price.amount,
                  currency: item.data.price.currency
                },
                props: {
                  type: 'GENERAL'
                }
              }
            }
          }
        }
      })
      this.$apollo.mutate({
        mutation: CreateOrder,
        variables: { data }, // ,
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        update: this.updateCache
      }).then(res => {
        this.$router.replace({ name: 'orderDetails', params: { id: res.data.createOrder.uid } })
      }).catch(error => {
        this.$q.notify({
          color: 'negative',
          message: 'No pudimos crear el pedido :(',
          icon: 'report_problem'
        })
        if (error.graphQLErrors.length > 0) console.error(error.graphQLErrors)
        else console.log(error)
      })
    },
    addItem (item) {
      this.order.items.push({
        data: item
      })
      this.$refs.newItem.hide()
    },
    nextStep () {
      switch (this.step) {
        case 1:
          // Continue to next step only if there's at least one item and no item is being edited
          if (this.order.items.length > 0 && this.editCounter === 0) this.$refs.stepper.next()
          else {
            this.$q.notify({
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
              this.$q.notify({
                color: 'negative',
                message: 'Completa los campos',
                icon: 'report_problem'
              })
            }
          })
          break
      }
    },
    ...mapActions(['changeActiveToolbar'])
  },
  beforeRouteLeave (to, from, next) {
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
