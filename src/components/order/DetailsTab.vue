<template>
  <q-card bordered flat>
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        expand-separator
        default-opened
        switch-toggle-side
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <template v-slot:header>
          <q-item-section>Resumen</q-item-section>
          <q-item-section side>
            <div class="row row q-gutter-x-md">
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
                icon="clear"
                color="red"
                size="0.75em"
                flat
                dense
                round
                v-if="editMode"
                @click.stop="clear()"
              >
                <q-tooltip>Cancelar</q-tooltip>
              </q-btn>
              <q-btn
                icon="done"
                color="teal"
                size="0.75em"
                flat
                dense
                round
                v-if="editMode"
                @click.stop="save()"
              >
                <q-tooltip>Guardar</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </template>
        <q-card>
          <q-form>
            <q-card-section class=" q-gutter-y-xs">
              <q-input
                dense
                standout="bg-blue-1"
                input-class="text-black"
                label="Nombre del pedido"
                v-model="name"
                :readonly="!editMode"
                :borderless="!editMode"
              />
              <q-select
                dense
                color="red"
                standout="bg-blue-1"
                label="Estado"
                v-model="status"
                :options="statusOptions"
                :readonly="!editMode"
                :borderless="!editMode"
              />
              <q-input dense label="Total" v-model="totalAmount" readonly borderless/>
            </q-card-section>
          </q-form>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="perm_identity"
        switch-toggle-side
        label="Cliente"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card>
          <q-card-section>
            <q-input dense label="Nombre" v-model="customer" readonly borderless/>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="date_range"
        switch-toggle-side
        label="Fechas"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card>
          <q-card-section>
            <q-input dense label="Pedido el" readonly borderless v-model="createdAt"/>
          </q-card-section>
          <q-card-section>
            <q-input dense label="Actualizado el" readonly borderless v-model="updatedAt"/>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import UpdateOrder from 'src/graphql/mutations/UpdateOrder.gql'
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import UserOrders from 'src/graphql/queries/UserOrders.gql'
import { Auth } from 'src/helpers'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'HOrderDetailsTab',
  props: {
    value: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      statusOptions: [
        { label: 'Nuevo', value: 'OPEN', icon: 'check' },
        { label: 'Entregado', value: 'WON', icon: 'check' },
        { label: 'Cancelado', value: 'CLOSED', icon: 'cancel_presentation' },
        { label: 'En Proceso', value: 'IN_PROCESS', icon: 'input' }
      ],
      editMode: false,
      order: { ...this.value },
      data: {} // mutation variable
    }
  },
  watch: {
    value (newVal) {
      this.order = { ...this.value }
    }
  },
  methods: {
    updateCache (cache, { data: { updateOrder } }) {
      try {
        // Read order details cache
        let cached = cache.readQuery({
          query: OrderDetails,
          variables: {
            id: this.order.id
          }
        })
        cached.order = { ...cached.order, ...updateOrder }
        // Update order details cache
        cache.writeQuery({
          query: OrderDetails,
          variables: {
            id: this.order.id
          },
          data: cached
        })
        // Read orders cache
        cached = cache.readQuery({
          query: UserOrders,
          variables: {
            id: Auth.userId
          }
        })
        const orders = cached.user.orders.edges
        const index = orders.findIndex(({ node }) => node.uid === this.order.id)
        orders[index].node = { ...orders[index].node, ...updateOrder }
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
    clear () {
      this.order = { ...this.value } // revert changes
      this.data = {} // reset temporary changes
      this.editMode = false // disable edit mode
    },
    save () {
      this.$apollo.mutate({
        mutation: UpdateOrder,
        variables: { id: this.order.id, data: this.data },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        update: this.updateCache
      }).then(res => {
        this.editMode = false
        this.$q.notify({ color: 'positive', message: 'Cambios guardados', icon: 'check_circle' })
      }).catch(err => {
        this.$q.notify({ color: 'negative', message: 'No pudimos guardar los cambios :(', icon: 'report_problem' })
        if (err.graphQLErrors.length > 0) console.error(err.graphQLErrors)
        else console.log(err)
      })
    },
    ...mapActions([
      'emitEvent'
    ])
  },
  computed: {
    customer () {
      const name1 = this.order.customer.name1 ? this.order.customer.name1 : ''
      const name2 = this.order.customer.name2 ? this.order.customer.name2 : ''
      const lastName1 = this.order.customer.lastName1
        ? this.order.customer.lastName1
        : ''
      const lastName2 = this.order.customer.lastName2
        ? this.order.customer.lastName2
        : ''
      return `${name1} ${name2} ${lastName1} ${lastName2}`.replace(/\s+/g, ' ')
    },
    createdAt () {
      return date.formatDate(this.order.createdAt, 'DD/MM/YYYY HH:mm:ss')
    },
    updatedAt () {
      return date.formatDate(this.order.updatedAt, 'DD/MM/YYYY HH:mm:ss')
    },
    totalAmount () {
      return this.order.items.reduce((acc, item) => acc + item.data.price, 0)
    },
    status: {
      get () {
        return this.statusOptions.find(
          status => status.value === this.order.stage
        )
      },
      set (status) {
        this.data.stage = status.value
        this.order.stage = status.value
      }
    },
    name: {
      get () {
        return this.order.name
      },
      set (name) {
        this.data.name = name
        this.order.name = name
      }
    }
  }
}
</script>

<style>
</style>
