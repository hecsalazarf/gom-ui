<template>
  <q-card flat>
    <q-list class="q-gutter-y-sm">
      <q-expansion-item
        class="bg-secondary h-rounded-borders-20"
        default-opened
        switch-toggle-side
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <template v-slot:header>
          <q-item-section>Resumen</q-item-section>
          <q-item-section side>
            <div class="row row q-gutter-x-md">
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
                v-if="editMode"
                icon="clear"
                color="red"
                size="0.75em"
                flat
                dense
                round
                @click.stop="clear()"
              >
                <q-tooltip>Cancelar</q-tooltip>
              </q-btn>
              <q-btn
                v-if="editMode"
                icon="done"
                color="teal"
                size="0.75em"
                flat
                dense
                round
                @click.stop="$refs.form.validate(true).then(out => { if(out) save() })"
              >
                <q-tooltip>Guardar</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </template>
        <q-card class="bg-secondary">
          <q-form ref="form">
            <q-card-section class=" q-gutter-y-xs">
              <q-input
                v-model="name"
                dense
                standout="bg-secondary"
                input-class="text-black"
                label="Nombre del pedido"
                :readonly="!editMode"
                :borderless="!editMode"
                type="text"
                maxlength="40"
                :rules="[ val => !!val || '* Campo obligatorio', val => val.length <= 40 || 'Máximo 40 caracteres' ]"
                hide-bottom-space
              />
              <h-status-select
                v-model="status"
                :readonly="!editMode"
                :borderless="!editMode"
              />
              <q-input
                v-model="totalAmount"
                dense
                prefix="$"
                label="Total"
                readonly
                borderless
              />
            </q-card-section>
          </q-form>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="bg-secondary h-rounded-borders-20"
        icon="perm_identity"
        switch-toggle-side
        label="Cliente"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card class="bg-secondary">
          <q-card-section>
            <q-input
              v-model="customer"
              dense
              label="Nombre"
              readonly
              borderless
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="bg-secondary h-rounded-borders-20"
        icon="date_range"
        switch-toggle-side
        label="Fechas"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card class="bg-secondary">
          <q-card-section>
            <q-input
              v-model="createdAt"
              dense
              label="Pedido el"
              readonly
              borderless
            />
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="updatedAt"
              dense
              label="Actualizado el"
              readonly
              borderless
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import UpdateOrder from 'src/graphql/mutations/UpdateOrder.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'HOrderDetailsTab',
  components: {
    'h-status-select': () => import('components/order/StatusSelect.vue')
  },
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
      order: { ...this.value },
      data: {} // mutation variable
    }
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
      return this.order.items.reduce(
        (acc, item) => acc + item.data.price.amount,
        0).toFixed(2) // toFixed() prevents floating point inaccuracy
    },
    status: {
      get () {
        return this.order.stage
      },
      set (status) {
        if (status !== this.value.stage) this.data.stage = status.value // if it changed, save it
        else delete this.data.stage // otherwise remove key from data object
        this.order.stage = status.value
      }
    },
    name: {
      get () {
        return this.order.name
      },
      set (name) {
        if (name !== this.value.name) this.data.name = name
        else delete this.data.name
        this.order.name = name
      }
    }
  },
  watch: {
    value (newVal) {
      this.order = { ...this.value }
    }
  },
  methods: {
    clear () {
      this.order = { ...this.value } // revert changes
      this.data = {} // reset temporary changes
      this.editMode = false // disable edit mode
    },
    save () {
      if (Object.keys(this.data).length === 0) {
        this.editMode = false
        return // Do not save if no changes
      }
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: UpdateOrder,
        variables: { id: this.order.id, data: this.data },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        }
      }).then(res => {
        this.editMode = false
        this.$q.loading.hide()
        this.$q.notify({ color: 'positive', message: 'Cambios guardados', icon: 'check_circle' })
      }).catch(err => {
        this.$q.loading.hide()
        this.$q.notify({ color: 'negative', message: 'No pudimos guardar los cambios :(', icon: 'report_problem' })
        if (err.graphQLErrors.length > 0) console.error(err.graphQLErrors)
        else console.log(err)
      })
    },
    ...mapActions([
      'emitEvent'
    ])
  }
}
</script>

<style scoped lang="stylus">
.q-expansion-item__content > .q-card
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
</style>
