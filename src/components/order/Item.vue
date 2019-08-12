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
          :label="$t('item.description')"
          :readonly="!editMode"
          :borderless="!editMode"
          type="text"
          maxlength="40"
          :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
          hide-bottom-space
        />
        <!-- CASL permission. ONLY SELLER ROLE -->
        <can
          do="role"
          on="seller"
        >
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
                <q-tooltip>{{ $t('app.edit') }}</q-tooltip>
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
                <q-tooltip>{{ $t('app.delete') }}</q-tooltip>
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
                <q-tooltip>{{ $t('app.abort') }}</q-tooltip>
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
                <q-tooltip>{{ $t('app.save') }}</q-tooltip>
              </q-btn>
            </div>
          </div>
        </can>
        <q-input
          v-model="code"
          class="col-7"
          input-class="text-caption text-black"
          standout="bg-secondary"
          dense
          :label="$t('item.code')"
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
          :label="$t('item.provider')"
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
          v-model.number="quantity"
          class="col-3"
          standout="bg-secondary"
          input-class="text-black"
          dense
          :label="$t('item.quantity')"
          :readonly="!editMode"
          :borderless="!editMode"
          type="number"
          step="0.01"
          :rules="[ val => val > 0 || $t('order.rules.minimum', { count: 1 }), val => val < 10000 || $t('order.rules.too_much') ]"
          hide-bottom-space
        />
        <q-input
          v-model.number="price"
          class="col-4"
          standout="bg-secondary"
          input-class="text-black"
          dense
          :label="$tc('pricing.label', 1)"
          type="tel"
          prefix="$"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          :readonly="!editMode"
          :borderless="!editMode"
          :rules="[ val => !!val || $t('app.rules.required'), val => val < 100000 || $t('order.rules.too_much') ]"
          hide-bottom-space
        />
        <q-input
          v-model="total"
          class="col"
          input-class="text-black text-weight-medium"
          standout="bg-secondary"
          readonly
          dense
          :label="$t('pricing.total')"
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
import RemoveItems from 'src/graphql/mutations/RemoveItems.gql'
// import gql from 'graphql-tag'
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
          this.data.pricing = {
            update: {
              data: {
                amount: amount,
                currency: 'MXN' // defaul
              },
              where: {
                uid: this.item.price.uid
              }
            }
          }
        } else delete this.data.pricing
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
    deleteIt () {
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: RemoveItems,
        variables: {
          data: {
            items: {
              delete: {
                uid: this.item.id
              }
            }
          },
          where: {
            uid: this.activeOrder
          }
        }
      })
        .then(res => this.onSuccess(res))
    },
    clear () {
      this.item = JSON.parse(JSON.stringify(this.value)) // revert changes
      this.data = {} // reset temporary changes
      this.editMode = false // disable edit mode
    },
    save () {
      // if noMutations and available data, emit submit event only
      if (this.noMutations || (Object.keys(this.data).length === 0)) {
        this.editMode = false
        this.$emit('change', this.item)
        return
      }
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: UpdateItem,
        variables: {
          data: {
            items: {
              update: {
                where: {
                  uid: this.item.id
                },
                data: this.data
              }
            }
          },
          where: {
            uid: this.activeOrder
          }
        }
      }).then(res => this.onSuccess(res))
    },
    onSuccess (response) {
      this.$q.loading.hide()
      this.clear() // reset submitted data
      this.$q.notify({
        color: 'positive',
        /*
        * When an item is deleted, the Vue i18n instance is set to null in
        * the component, causing a null type error during the notification
        * execution. To prevent it, $t() is taken from the root instance.
        * This issue is detailed in:
        * https://github.com/kazupon/vue-i18n/issues/184#issuecomment-481379038
        */
        message: this.$root.$t('notifications.positive.changes_saved'),
        icon: 'check_circle'
      })
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
