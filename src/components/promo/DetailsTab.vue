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
          <q-item-section>{{ $t('promo.review') }}</q-item-section>
          <!-- <q-item-section side>
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
                :aria-label="$t('app.edit')"
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
                :aria-label="$t('app.abort')"
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
                :aria-label="$t('app.save')"
                @click.stop="$refs.form.validate(true).then(out => { if(out) save() })"
              >
                <q-tooltip>{{ $t('app.save') }}</q-tooltip>
              </q-btn>
            </div>
          </q-item-section> -->
        </template>
        <q-card class="bg-secondary">
          <q-form ref="form">
            <q-card-section class="q-col-gutter-xs">
              <div class="row justify-between items-end">
                <q-input
                  v-model="codigo"
                  class="col-12"
                  dense
                  standout="bg-secondary"
                  input-class="text-black"
                  :label="$t('promo.code')"
                  :readonly="!editMode"
                  :borderless="!editMode"
                  type="text"
                  maxlength="40"
                  :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
                  hide-bottom-space
                  stack-label
                />
              </div>
              <q-input
                v-model="nombre"
                dense
                standout="bg-secondary"
                input-class="text-black"
                :label="$t('promo.name')"
                :readonly="!editMode"
                :borderless="!editMode"
                type="text"
                maxlength="40"
                :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
                hide-bottom-space
              />
              <div class="row q-col-gutter-xs">
                <h-datetime
                  v-model="fechaInicio"
                  dense
                  class="col-xs-12"
                  standout="bg-secondary"
                  input-class="text-black"
                  :label="$t('promo.start')"
                  :readonly="!editMode"
                  :borderless="!editMode"
                  hide-bottom-space
                  mask="DD-MMM-YYYY hh:mm A"
                />
                <h-datetime
                  v-model="fechaFin"
                  dense
                  class="col-xs-12"
                  standout="bg-secondary"
                  input-class="text-black"
                  :label="$t('promo.end')"
                  :readonly="!editMode"
                  :borderless="!editMode"
                  hide-bottom-space
                  mask="DD-MMM-YYYY hh:mm A"
                />
              </div>
              <q-field
                dense
                class="col-xs-4 col-sm-3 col-md-2"
                standout="bg-secondary"
                input-class="text-black"
                :label="$t('promo.category')"
                stack-label
                hide-bottom-space
                :readonly="!editMode"
                :borderless="!editMode"
              >
                <template v-slot:control>
                  <h-color
                    v-model="color"
                    :options="$options.colors"
                  />
                </template>
              </q-field>
            </q-card-section>
          </q-form>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="bg-secondary h-rounded-borders-20"
        icon="receipt"
        switch-toggle-side
        :label="$t('promo.content')"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card class="bg-secondary">
          <q-card-section>
            <h-text-editor v-model="editor" />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="bg-secondary h-rounded-borders-20"
        icon="history"
        switch-toggle-side
        :label="$t('promo.log')"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card class="bg-secondary">
          <q-card-section>
            <q-input
              v-model="createdAt"
              dense
              :label="$t('promo.createdAt')"
              readonly
              borderless
            />
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="updatedAt"
              dense
              :label="$t('promo.updatedAt')"
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

export default {
  name: 'HPromoDetailsTab',
  components: {
    'h-color': () => import('components/promo/ColorPickButton.vue'),
    'h-datetime': () => import('components/misc/DateTimePicker.vue'),
    'h-text-editor': () => import('components/misc/TextEditor.vue')
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
      editMode: true,
      promo: { ...this.value },
      data: {}, // mutation variable
      nombre: '',
      color: '',
      codigo: '',
      fechaInicio: '',
      fechaFin: '',
      editor: ''
    }
  },
  computed: {
    createdAt () {
      if (typeof this.promo.createdAt === 'undefined') {
        return ''
      }
      return date.formatDate(this.promo.createdAt, 'DD/MM/YYYY HH:mm:ss')
    },
    updatedAt () {
      if (typeof this.promo.updatedAt === 'undefined') {
        return ''
      }
      return date.formatDate(this.promo.updatedAt, 'DD/MM/YYYY HH:mm:ss')
    },
    status: {
      get () {
        if (typeof this.promo.stage === 'undefined') {
          return ''
        }
        return this.promo.stage
      },
      set (status) {
        if (status !== this.value.stage) this.data.stage = status.value // if it changed, save it
        else delete this.data.stage // otherwise remove key from data object
        this.promo.stage = status.value
      }
    },
    name: {
      get () {
        if (typeof this.promo.name === 'undefined') {
          return ''
        }
        return this.promo.name
      },
      set (name) {
        if (name !== this.value.name) this.data.name = name
        else delete this.data.name
        this.promo.name = name
      }
    }
  },
  watch: {
    value (newVal) {
      this.promo = { ...this.value }
    }
  },
  methods: {
    clear () {
      this.promo = { ...this.value } // revert changes
      this.data = {} // reset temporary changes
      this.editMode = false // disable edit mode
    },
    save () {
      if (Object.keys(this.data).length === 0) {
        this.editMode = false
        return // Do not save if no changes
      }
      this.$q.loading.show()
      // this.$apollo.mutate({
      //   mutation: UpdateOrder,
      //   variables: {
      //     where: {
      //       uid: this.order.id
      //     },
      //     data: this.data
      //   }
      //   /* { id: this.order.id, data: this.data } */
      // }).then(res => {
      //   this.clear() // reset submitted data
      //   this.$q.loading.hide()
      //   this.$q.notify({ color: 'positive', message: this.$t('notifications.positive.changes_saved'), icon: 'check_circle' })
      // })
    }
  },
  colors: [
    {
      val: 'pink',
      name: 'pink'
    },
    {
      val: 'purple',
      name: 'purple'
    },
    {
      val: 'indigo',
      name: 'indigo'
    },
    {
      val: 'teal',
      name: 'teal'
    },
    {
      val: 'red',
      name: 'red'
    },
    {
      val: 'brown',
      name: 'brown'
    },
    {
      val: 'grey',
      name: 'grey'
    },
    {
      val: 'dark',
      name: 'dark'
    }
  ]
}
</script>

<style scoped lang="stylus">
.q-expansion-item__content > .q-card
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
</style>
