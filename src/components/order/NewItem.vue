<template>
  <q-dialog
    persistent
    :position="$q.platform.is.mobile ? 'bottom' : 'standard'"
    v-model="isShown"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialog"
  >
    <q-card flat>
      <q-form @submit="save()" @reset="clear()">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium">Nuevo artículo</div>
        </q-card-section>
        <q-card-section class="q-gutter-y-xs">
          <q-input
            input-class="text-subtitle1 text-weight-medium text-black"
            standout="bg-blue-1"
            dense
            label="Descripción"
            v-model="model.description"
            type="text"
            maxlength="40"
            :rules="[ val => !!val || '* Campo obligatorio', val => val.length <= 40 || 'Máximo 40 caracteres' ]"
            hide-bottom-space
          />
          <q-input
            input-class="text-caption text-black"
            standout="bg-blue-1"
            dense
            label="Código"
            v-model="model.code"
            type="text"
            maxlength="15"
            :rules="[ val => val.length <= 15 || 'Máximo 15 caracteres' ]"
            hide-bottom-space
          />
        </q-card-section>
        <q-separator inset/>
        <q-card-section class="q-gutter-y-xs">
          <q-input
            standout="bg-blue-1"
            input-class="text-black"
            dense
            label="Precio"
            type="number"
            step="0.01"
            min="0"
            v-model.number="model.price"
            :rules="[ val => !!val || '* Campo obligatorio', val => val < 100000 || 'Ups, muy caro' ]"
            hide-bottom-space
          >
            <template v-slot:prepend>
              <q-icon name="monetization_on" color="primary"/>
            </template>
          </q-input>
          <q-input
            dense
            standout="bg-blue-1"
            input-class="text-black"
            label="Cantidad"
            type="number"
            min="1"
            v-model.number="model.quantity"
            :rules="[ val => val > 0 || 'Debe haber al menos 1', val => val < 10000 || 'Es demasiado' ]"
            hide-bottom-space
          >
            <template v-slot:prepend>
              <q-icon name="format_list_numbered" color="primary"/>
            </template>
          </q-input>
          <q-input
            dense
            standout="bg-blue-1"
            input-class="text-black"
            label="Marca"
            v-model="model.provider"
            type="text"
            maxlength="20"
            :rules="[ val => val.length <= 20 || 'Máximo 20 caracteres' ]"
            hide-bottom-space
          >
            <template v-slot:prepend>
              <q-icon name="stars" color="primary"/>
            </template>
          </q-input>
        </q-card-section>
        <q-separator inset/>
        <q-card-actions align="around">
          <q-btn flat round color="red" icon="clear" type="reset">
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
          <q-btn flat round color="teal" icon="done" type="submit">
            <q-tooltip>Guardar</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import AddItemsToOrder from 'src/graphql/mutations/AddItemsToOrder.gql'
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'HNewItem',
  data () {
    return {
      isShown: false,
      model: {
        description: '',
        code: '',
        price: 0,
        quantity: 1,
        provider: ''
      }
    }
  },
  methods: {
    show () {
      this.isShown = true
    },
    clear () {
      this.isShown = false
      this.model = {
        description: '',
        code: '',
        price: 0,
        quantity: 1,
        provider: ''
      }
    },
    save () {
      this.$apollo
        .mutate({
          mutation: AddItemsToOrder,
          variables: { id: this.activeOrder, data: this.itemData },
          context: {
            headers: {
              'X-Csrf-Token': this.$q.cookies.get('csrf-token')
            }
          },
          update: this.updateCache
        })
        .then(res => this.onSuccess(res))
        .catch(err => this.onError(err))
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
    },
    onSuccess (response) {
      this.isShown = false
      this.$q.notify({
        color: 'positive',
        message: 'Cambios guardados',
        icon: 'check_circle'
      })
    },
    onError (error) {
      console.log(error)
      this.$q.notify({
        color: 'negative',
        message: 'No pudimos guardar los cambios :(',
        icon: 'report_problem'
      })
      if (error.graphQLErrors.length > 0) console.error(error.graphQLErrors)
      else console.log(error)
    }
  },
  computed: {
    itemData () {
      return {
        edges: {
          items: [
            {
              node: {
                code: this.model.code,
                quantity: this.model.quantity,
                description: this.model.description,
                provider: this.model.provider,
                edges: {
                  pricing: [
                    {
                      node: {
                        amount: this.model.price,
                        currency: 'MXN' // default
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
  }
}
</script>

<style>
</style>
