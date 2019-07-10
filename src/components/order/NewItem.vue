<template>
  <q-card flat>
    <q-form
      @submit="save()"
      @reset="clear()"
    >
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">
          Nuevo artículo
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-y-xs">
        <q-input
          v-model="model.description"
          autofocus
          input-class="text-subtitle1 text-weight-medium text-black"
          standout="bg-secondary"
          dense
          label="Descripción"
          type="text"
          maxlength="40"
          :rules="[ val => !!val || 'Campo obligatorio', val => val.length <= 40 || 'Máximo 40 caracteres' ]"
          hide-bottom-space
        />
        <q-input
          v-model="model.code"
          input-class="text-caption text-black"
          standout="bg-secondary"
          dense
          label="Código"
          type="text"
          maxlength="15"
          hide-bottom-space
        />
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-gutter-y-xs">
        <q-input
          v-model.number="model.price.amount"
          standout="bg-secondary"
          input-class="text-black"
          dense
          prefix="$"
          label="Precio"
          type="tel"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          :rules="[ val => !!val || 'Campo obligatorio', val => val < 100000 || 'Ups, muy caro' ]"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon
              name="monetization_on"
              color="primary"
            />
          </template>
        </q-input>
        <q-input
          v-model.number="model.quantity"
          dense
          standout="bg-secondary"
          input-class="text-black"
          label="Cantidad"
          type="number"
          min="1"
          :rules="[ val => val > 0 || 'Debe haber al menos 1', val => val < 10000 || 'Es demasiado' ]"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon
              name="format_list_numbered"
              color="primary"
            />
          </template>
        </q-input>
        <q-input
          v-model="model.provider"
          dense
          standout="bg-secondary"
          input-class="text-black"
          label="Marca"
          type="text"
          maxlength="20"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon
              name="stars"
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
        >
          <q-tooltip>Cancelar</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="teal"
          icon="done"
          type="submit"
        >
          <q-tooltip>Guardar</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import AddItemsToOrder from 'src/graphql/mutations/AddItemsToOrder.gql'
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
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
    itemData () {
      return {
        edges: {
          items: [
            {
              node: {
                code: this.model.code === '' ? undefined : this.model.code,
                quantity: this.model.quantity,
                description: this.model.description,
                provider: this.model.provider === '' ? undefined : this.model.provider,
                edges: {
                  pricing: [
                    {
                      node: {
                        amount: this.model.price.amount,
                        currency: this.model.price.currency // default
                      },
                      props: {
                        type: 'GENERAL'
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    },
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
        variables: { id: this.activeOrder, data: this.itemData },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        update: this.updateCache
      })
        .then(res => {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'positive',
            message: 'Cambios guardados',
            icon: 'check_circle'
          })
          this.$emit('done')
        })
        .catch(error => {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'No pudimos guardar los cambios :(',
            icon: 'report_problem'
          })
          if (error.graphQLErrors.length > 0) console.error(error.graphQLErrors)
          else console.log(error)
        })
    },
    updateCache (cache, { data }) {
      try {
        // Read order details cache
        let cached = cache.readQuery({
          query: OrderDetails,
          variables: {
            id: this.activeOrder
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
    }
  }
}
</script>

<style>
</style>
