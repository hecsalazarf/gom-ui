<template>
  <q-card
    bordered
    flat
    class="bg-secondary h-rounded-borders-20 no-border q-pa-sm"
  >
    <q-form
      @submit="save()"
      @reset="clear()"
    >
      <q-card-section class="q-gutter-xs row q-pa-xs">
        <q-input
          v-model="description"
          class="col-7"
          input-class="text-subtitle1 text-weight-medium text-black"
          standout="bg-secondary"
          dense
          label="Descripción"
          :readonly="!editMode"
          :borderless="!editMode"
          type="text"
          maxlength="40"
          :rules="[ val => !!val || 'Campo obligatorio', val => val.length <= 40 || 'Máximo 40 caracteres' ]"
          hide-bottom-space
        />
        <div class="col">
          <div
            v-if="!readonly"
            class="row justify-end full-width"
          >
            <q-btn
              v-show="!editMode"
              icon="edit"
              color="accent"
              size="0.75em"
              flat
              dense
              round
              @click.stop="editMode = true"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!(noRemovable || editMode)"
              class="q-ml-md"
              icon="delete"
              color="accent"
              size="0.75em"
              flat
              dense
              round
              @click.stop="confirmDelete()"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="editMode"
              icon="clear"
              color="red"
              size="0.75em"
              flat
              dense
              round
              type="reset"
            >
              <q-tooltip>Cancelar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="editMode"
              class="q-ml-md"
              icon="done"
              color="teal"
              size="0.75em"
              flat
              dense
              round
              type="submit"
            >
              <q-tooltip>Guardar</q-tooltip>
            </q-btn>
          </div>
        </div>
        <q-input
          v-model="code"
          class="col-7"
          input-class="text-caption text-black"
          standout="bg-secondary"
          dense
          label="Código"
          :readonly="!editMode"
          :borderless="!editMode"
          type="text"
          maxlength="15"
          hide-bottom-space
        />
        <q-input
          v-model="provider"
          class="col"
          standout="bg-secondary"
          input-class="text-black"
          dense
          label="Marca"
          :readonly="!editMode"
          :borderless="!editMode"
          type="text"
          maxlength="20"
          hide-bottom-space
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-xs q-pa-xs row">
        <q-input
          v-model.number="price"
          class="col-4"
          standout="bg-secondary"
          input-class="text-black"
          dense
          label="Precio"
          type="tel"
          prefix="$"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          :readonly="!editMode"
          :borderless="!editMode"
          :rules="[ val => !!val || 'Campo obligatorio', val => val < 100000 || 'Ups, muy caro' ]"
          hide-bottom-space
        />
        <q-input
          v-model.number="quantity"
          class="col-3"
          standout="bg-secondary"
          input-class="text-black"
          dense
          label="Cantidad"
          :readonly="!editMode"
          :borderless="!editMode"
          type="number"
          step="0.01"
          :rules="[ val => val > 0 || 'Debe haber al menos 1', val => val < 10000 || 'Es demasiado' ]"
          hide-bottom-space
        />
        <q-input
          v-model="total"
          class="col"
          input-class="text-black text-weight-medium"
          standout="bg-secondary"
          readonly
          dense
          label="Total"
          prefix="$"
          borderless
          type="text"
          hide-bottom-space
        />
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import UpdateItem from 'src/graphql/mutations/UpdateItem.gql'
import UpdatePrice from 'src/graphql/mutations/UpdatePrice.gql'
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import RemoveItems from 'src/graphql/mutations/RemoveItems.gql'
import gql from 'graphql-tag'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'HOrderItem',
  props: {
    value: {
      type: Object,
      default: () => {},
      required: true
    },
    noMutations: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    noRemovable: {
      type: Boolean,
      default: false
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
        return this.item.price.amount.toFixed(2) // toFixed(2)) to guarantee proper masked value (#11, #20)
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
    total () {
      return (+this.price * this.quantity).toFixed(2)
    },
    ...mapGetters(['activeOrder'])
  },
  watch: {
    value (val) {
      this.item = JSON.parse(JSON.stringify(val))
    },
    editMode (val) {
      this.$emit('edit-mode', val)
    }
  },
  methods: {
    updateCache (cache, { data }) {
      try {
        if (data.removeItems) {
          // item removal
          // Read order details cache
          let cached = cache.readQuery({
            query: OrderDetails,
            variables: {
              id: this.activeOrder
            }
          })
          const items = cached.order.items.edges
          const index = items.findIndex(({ node }) => node.uid === this.item.id)
          items.splice(index, 1)
          // Update order details cache
          cache.writeQuery({
            query: OrderDetails,
            variables: {
              id: this.activeOrder
            },
            data: cached
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    deleteIt () {
      this.$q.loading.show()
      this.$apollo.mutate({
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
      // if noMutations and available data, emit submit event only
      const count = Object.entries(this.data).length
      const edges = Object.entries(this.edges).length
      if (this.noMutations && (count > 0 || edges > 0)) {
        this.editMode = false
        this.$emit('change', this.item)
        return
      }

      let promises = []
      if (Object.entries(this.data).length > 0) {
        promises.push(this.saveItem())
      }
      if (Object.entries(this.edges).length > 0 && this.edges.pricing) {
        promises.push(this.savePrice())
      }
      if (promises.length > 0) {
        this.$q.loading.show()
        Promise.all(promises)
          .then(res => {
            this.$apollo.mutate({
              mutation: gql`
                mutation UpdateOrder($id: String!, $data: OrderUpdateInp!) {
                  updateOrder(id: $id, data: $data) {
                    uid
                    updatedAt
                  }
                }`,
              variables: { id: this.activeOrder, data: {} },
              context: {
                headers: {
                  'X-Csrf-Token': this.$q.cookies.get('csrf-token')
                }
              }
            })
          })
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
      this.$q.loading.hide()
      this.editMode = false
      this.$q.notify({
        color: 'positive',
        message: 'Cambios guardados',
        icon: 'check_circle'
      })
    },
    onError (error) {
      this.$q.loading.hide()
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
          if (this.noMutations) {
            this.$emit('delete', this.item)
          } else {
            this.deleteIt()
          }
        })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
