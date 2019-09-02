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
          <q-item-section>{{ $t('order.review') }}</q-item-section>
          <q-item-section side>
            <div
              v-if="!readonly"
              class="row row q-gutter-x-md"
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
                <q-tooltip>{{ $t('app.edit') }}</q-tooltip>
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
                <q-tooltip>{{ $t('app.abort') }}</q-tooltip>
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
                <q-tooltip>{{ $t('app.save') }}</q-tooltip>
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
                :label="$t('order.description')"
                :readonly="!editMode"
                :borderless="!editMode"
                type="text"
                maxlength="40"
                :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
                hide-bottom-space
              />
              <h-status-select
                v-model="status"
                :readonly="!editMode"
                :borderless="!editMode"
              />
              <q-input
                v-if="parseFloat(totalAmount) > 0"
                v-model="totalAmount"
                dense
                prefix="$"
                input-class="text-weight-bold text-accent"
                :label="$t('pricing.total')"
                readonly
                borderless
              />
              <q-field
                v-else
                dense
                stack-label
                :label="$t('pricing.total')"
                readonly
                borderless
              >
                <template v-slot:control>
                  <q-badge
                    align="middle"
                  >
                    {{ $t('app.to_be_confirmed') }}
                  </q-badge>
                </template>
              </q-field>
            </q-card-section>
          </q-form>
        </q-card>
      </q-expansion-item>

      <!-- Display if user has the CASL permissions -->
      <can
        do="read"
        on="bp"
      >
        <q-expansion-item
          class="bg-secondary h-rounded-borders-20"
          icon="perm_identity"
          switch-toggle-side
          :label="$tc('customer.label', 1)"
          default-opened
          header-class="text-subtitle1 text-weight-medium text-primary"
        >
          <q-card class="bg-secondary">
            <q-card-section>
              <q-field
                dense
                :label="$t('customer.name')"
                readonly
                borderless
                stack-label
              >
                <template v-slot:default>
                  <router-link :to="{ name: 'customerDetails', params: { id: typeof order.customer === 'undefined' ? '1' : order.customer.uid }}">
                    <div
                      class="self-center full-width all-pointer-events"
                    >
                      {{ customer }}
                    </div>
                  </router-link>
                </template>
              </q-field>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </can>

      <q-expansion-item
        class="bg-secondary h-rounded-borders-20"
        icon="date_range"
        switch-toggle-side
        :label="$t('order.dates')"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card class="bg-secondary">
          <q-card-section>
            <q-input
              v-model="createdAt"
              dense
              :label="$t('order.createdAt')"
              readonly
              borderless
            />
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="updatedAt"
              dense
              :label="$t('order.updatedAt')"
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
    },
    readonly: {
      type: Boolean,
      default: false
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
      if (typeof this.order.customer === 'undefined') {
        return ''
      }

      const name1 = this.order.customer.name1
      const lastName1 = this.order.customer.lastName1

      // Turn first letter to uppercase
      if (lastName1 === '' ||
            !lastName1) { // check it's not null. Fix (#15)
        return (
          name1.charAt(0).toUpperCase() + name1.slice(1)
        )
      } else {
        return `${name1.charAt(0).toUpperCase() +
            name1.slice(1)} ${lastName1.charAt(0).toUpperCase() +
            lastName1.slice(1)}`
      }
    },
    createdAt () {
      if (typeof this.order.createdAt === 'undefined') {
        return ''
      }
      return date.formatDate(this.order.createdAt, 'DD/MM/YYYY HH:mm:ss')
    },
    updatedAt () {
      if (typeof this.order.updatedAt === 'undefined') {
        return ''
      }
      return date.formatDate(this.order.updatedAt, 'DD/MM/YYYY HH:mm:ss')
    },
    totalAmount () {
      if (typeof this.order.items === 'undefined') {
        return '0'
      }
      return this.order.items.reduce(
        (acc, item) => acc + (item.data.price.amount * item.data.quantity),
        0).toFixed(2) // toFixed() prevents floating point inaccuracy
    },
    status: {
      get () {
        if (typeof this.order.stage === 'undefined') {
          return ''
        }
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
        if (typeof this.order.name === 'undefined') {
          return ''
        }
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
        variables: {
          where: {
            uid: this.order.id
          },
          data: this.data
        }
        /* { id: this.order.id, data: this.data } */
      }).then(res => {
        this.clear() // reset submitted data
        this.$q.loading.hide()
        this.$q.notify({ color: 'positive', message: this.$t('notifications.positive.changes_saved'), icon: 'check_circle' })
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
