<template>
  <q-card bordered flat class="bg-blue-1 h-rounded-borders-20 no-border q-pa-sm">
    <q-form @submit="save()" @reset="clear()">
      <div class="row">
        <q-card-section class="q-gutter-y-xs col-8 q-pa-xs">
          <q-input
            input-class="text-subtitle1 text-weight-medium text-black"
            standout="bg-blue-1"
            dense
            label="Descripción"
            v-model="description"
            :readonly="!editMode"
            :borderless="!editMode"
            type="text"
            maxlength="40"
            :rules="[ val => !!val || 'Campo obligatorio', val => val.length <= 40 || 'Máximo 40 caracteres' ]"
            hide-bottom-space
          />
          <q-input
            input-class="text-caption text-black"
            standout="bg-blue-1"
            dense
            label="Código"
            v-model="code"
            :readonly="!editMode"
            :borderless="!editMode"
            type="text"
            maxlength="15"
            :rules="[ val => val.length <= 15 || 'Máximo 15 caracteres' ]"
            hide-bottom-space
          />
        </q-card-section>
        <q-card-section class="col-4 q-pr-xs q-pl-xs">
          <div class="row justify-end q-pr-sm">
            <q-btn
              icon="edit"
              color="primary"
              size="0.75em"
              flat
              dense
              round
              v-show="!editMode"
              @click.stop="editMode = true"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              class="q-ml-md"
              icon="delete"
              color="primary"
              size="0.75em"
              flat
              dense
              round
              v-show="!editMode"
              @click.stop="confirmDelete()"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
            <q-btn
              icon="clear"
              color="red"
              size="0.75em"
              flat
              dense
              round
              type="reset"
              v-if="editMode"
            >
              <q-tooltip>Cancelar</q-tooltip>
            </q-btn>
            <q-btn
              class="q-ml-md"
              icon="done"
              color="teal"
              size="0.75em"
              flat
              dense
              round
              type="submit"
              v-if="editMode"
            >
              <q-tooltip>Guardar</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
      </div>
      <q-separator inset/>
        <q-card-section class="q-gutter-xs q-pa-xs row">
          <q-input
            class="col-4"
            standout="bg-blue-1"
            input-class="text-black"
            dense
            type="number"
            step="0.01"
            label="Precio"
            prefix="$"
            v-model.number="price"
            :readonly="!editMode"
            :borderless="!editMode"
            :rules="[ val => !!val || 'Campo obligatorio', val => val < 100000 || 'Ups, muy caro' ]"
            hide-bottom-space
          >
          </q-input>
          <q-input
            class="col-3"
            standout="bg-blue-1"
            input-class="text-black"
            dense
            label="Cantidad"
            v-model.number="quantity"
            :readonly="!editMode"
            :borderless="!editMode"
            type="number"
            :rules="[ val => val > 0 || 'Debe haber al menos 1', val => val < 10000 || 'Es demasiado' ]"
            hide-bottom-space
          >
          </q-input>
          <q-input
            class="col"
            standout="bg-blue-1"
            input-class="text-black"
            dense
            label="Marca"
            v-model="provider"
            :readonly="!editMode"
            :borderless="!editMode"
            type="text"
            maxlength="20"
            :rules="[ val => val.length <= 20 || 'Máximo 20 caracteres' ]"
            hide-bottom-space
          >
          </q-input>
        </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import UpdateItem from 'src/graphql/mutations/UpdateItem.gql'
import UpdatePrice from 'src/graphql/mutations/UpdatePrice.gql'
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import RemoveItems from 'src/graphql/mutations/RemoveItems.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'HOrderItem',
  props: {
    value: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      editMode: false,
      data: {},
      edges: {},
      // naive deep copy, for more complex one, use a differente approach
      item: JSON.parse(JSON.stringify(this.value))
    }
  },
  watch: {
    value (val) {
      this.item = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    updateCache (cache, { data }) {
      try {
        // Read order details cache
        let cached = cache.readQuery({
          query: OrderDetails,
          variables: {
            id: this.activeOrder
          }
        })
        const items = cached.order.items.edges
        const index = items.findIndex(({ node }) => node.uid === this.item.id)

        if (data.updateItem) {
          // item data
          items[index].node = { ...items[index].node, ...data.updateItem }
        }

        if (data.updatePrice) {
          // pricing data
          const pricing = items[index].node.pricing.edges
          const iprice = pricing.findIndex(
            ({ node }) => node.uid === this.edges.pricing.id
          )
          pricing[iprice].node = {
            ...pricing[iprice].node,
            ...data.updatePrice
          }
        }

        if (data.removeItems) {
          // item removal
          items.splice(index, 1)
        }

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
    deleteIt () {
      this.$apollo
        .mutate({
          mutation: RemoveItems,
          variables: { orderId: this.activeOrder, items: [this.item.id] },
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
    clear () {
      this.item = JSON.parse(JSON.stringify(this.value)) // revert changes
      this.data = {} // reset temporary changes
      this.edges = {}
      this.editMode = false // disable edit mode
    },
    save () {
      let promises = []
      if (Object.entries(this.data).length > 0) {
        promises.push(this.saveItem())
      }
      if (Object.entries(this.edges).length > 0 && this.edges.pricing) {
        promises.push(this.savePrice())
      }
      if (promises.length > 0) {
        Promise.all(promises)
          .then(res => this.onSuccess(res))
          .catch(err => this.onError(err))
      } else this.editMode = false
    },
    saveItem () {
      return this.$apollo.mutate({
        mutation: UpdateItem,
        variables: { id: this.item.id, data: this.data },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        update: this.updateCache
      })
    },
    savePrice () {
      return this.$apollo.mutate({
        mutation: UpdatePrice,
        variables: { id: this.edges.pricing.id, data: this.edges.pricing.data },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        update: this.updateCache
      })
    },
    onSuccess (response) {
      this.editMode = false
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
    },
    confirmDelete () {
      this.$q
        .dialog({
          title: `Esto borrará ${this.description}`,
          message: '¿Continuar?',
          position: 'bottom',
          persistent: true,
          cancel: {
            label: 'No',
            color: 'primary',
            flat: true
          },
          ok: {
            label: 'Sí',
            color: 'primary',
            flat: true
          },
          stackButtons: false,
          color: 'primary'
        })
        .onOk(() => {
          this.deleteIt()
        })
    }
  },
  computed: {
    code: {
      get () {
        return this.item.code
      },
      set (code) {
        if (code !== this.value.code) this.data.code = code // check changes
        else delete this.data.code // if no changes, remove it to avoid unnecessary save
        this.item.code = code
      }
    },
    quantity: {
      get () {
        return this.item.quantity
      },
      set (quantity) {
        if (quantity !== this.value.quantity) this.data.quantity = quantity
        else delete this.data.quantity
        this.item.quantity = quantity
      }
    },
    description: {
      get () {
        return this.item.description
      },
      set (description) {
        if (description !== this.value.description) this.data.description = description
        else delete this.data.description
        this.item.description = description
      }
    },
    provider: {
      get () {
        return this.item.provider
      },
      set (provider) {
        if (provider !== this.value.provider) this.data.provider = provider
        else delete this.data.provider
        this.item.provider = provider
      }
    },
    price: {
      get () {
        return this.item.price.amount
      },
      set (amount) {
        if (amount !== this.value.price.amount) {
          this.edges.pricing = {
            data: {
              amount: amount,
              currency: 'MXN' // default
            },
            id: this.item.price.uid
          }
        } else delete this.edges.pricing
        this.item.price.amount = amount
      }
    },
    ...mapGetters(['activeOrder'])
  }
}
</script>

<style scoped lang="stylus">
.q-card__section + .q-card__section
  padding-top: 16px
</style>
