<template>
  <q-card flat>
    <!-- Computed style is due to rendering issues on iOS -->
    <q-form
      :style="$q.platform.is.ios ? { 'max-height': '50vh' } : { }"
      class="scroll"
      @submit="save()"
      @reset="clear()"
    >
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">
          {{ $t('item.new') }}
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-y-xs">
        <q-input
          v-model="model.description"
          autofocus
          input-class="text-subtitle1 text-weight-medium text-black"
          standout="bg-secondary"
          dense
          :label="$t('item.description')"
          type="text"
          maxlength="40"
          :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
          hide-bottom-space
        />
        <q-input
          v-model="model.code"
          input-class="text-caption text-black"
          standout="bg-secondary"
          dense
          :label="$t('item.code')"
          type="text"
          maxlength="15"
          hide-bottom-space
        />
        <q-input
          v-model="model.provider"
          dense
          standout="bg-secondary"
          input-class="text-black"
          :label="$t('item.provider')"
          type="text"
          maxlength="20"
          hide-bottom-space
        />
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-gutter-y-xs">
        <!-- Check role so that customer cannot edit pricing (#43) -->
        <can
          do="role"
          on="seller"
        >
          <q-input
            v-model.number="model.price.amount"
            standout="bg-secondary"
            input-class="text-black"
            dense
            prefix="$"
            :label="$tc('pricing.label', 1)"
            type="tel"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            :rules="[ val => !!val || $t('app.rules.required'), val => val < 100000 || $t('order.rules.too_much')]"
            hide-bottom-space
          >
            <template v-slot:prepend>
              <q-icon
                name="monetization_on"
                color="primary"
              />
            </template>
          </q-input>
        </can>
        <q-input
          v-model.number="model.quantity"
          dense
          standout="bg-secondary"
          input-class="text-black"
          label="Cantidad"
          type="number"
          min="1"
          :rules="[ val => val > 0 || $t('order.rules.minimum', { count: 1 }), val => val < 10000 || $t('order.rules.too_much')]"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon
              name="format_list_numbered"
              color="primary"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-separator inset />
      <q-card-actions align="around">
        <q-btn
          flat
          round
          color="red"
          icon="clear"
          type="reset"
          :aria-label="$t('app.abort')"
        >
          <q-tooltip>{{ $t('app.abort') }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="teal"
          icon="done"
          type="submit"
          :aria-label="$t('app.save')"
        >
          <q-tooltip>{{ $t('app.save') }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import AddItemsToOrder from 'src/graphql/mutations/AddItemsToOrder.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'HNewItem',
  props: {
    noMutations: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      model: {
        description: '',
        code: '',
        price: {
          amount: 0,
          currency: 'MXN'
        },
        quantity: 1,
        provider: ''
      }
    }
  },
  computed: {
    ...mapGetters(['activeOrder'])
  },
  methods: {
    clear () {
      this.model = {
        description: '',
        code: '',
        price: 0,
        quantity: 1,
        provider: ''
      }
      this.$emit('reset')
    },
    save () {
      if (this.noMutations) {
        this.$emit('submit', this.model)
        return
      }
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: AddItemsToOrder,
        variables: {
          data: {
            items: {
              create: {
                code: this.model.code === '' ? undefined : this.model.code,
                quantity: this.model.quantity,
                description: this.model.description,
                provider: this.model.provider === '' ? undefined : this.model.provider,
                pricing: {
                  create: {
                    amount: this.model.price.amount,
                    currency: this.model.price.currency
                  }
                }
              }
            }
          },
          where: {
            uid: this.activeOrder
          }
        }
        // update: this.updateCache // LEFT FOR REFERENCE
      })
        .then(res => {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'positive',
            message: this.$t('notifications.positive.changes_saved'),
            icon: 'check_circle'
          })
          this.$emit('done')
        })
    }/* , LEFT FOR REFERENCE
    updateCache (cache, { data }) {
      try {
        // Read order details cache
        let cached = cache.readQuery({
          query: OrderDetails,
          variables: {
            where: {
              uid: this.activeOrder
            }
          }
        })

        cached.order.items.edges = data.updateOrder.items.edges
        cached.order.updatedAt = data.updateOrder.updatedAt
        // Update order details cache
        cache.writeQuery({
          query: OrderDetails,
          variables: {
            id: this.activeOrder
          },
          data: cached
        })
      } catch (err) {
        console.log(err)
      }
    } */
  }
}
</script>

<style>
</style>
