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
                  v-model="code"
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
                v-model="name"
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
                  v-model="start"
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
                  v-model="end"
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
                    v-model="category"
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
            <h-text-editor v-model="content" />
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
      promotion: { ...this.value },
      data: {} // mutation variable
    }
  },
  computed: {
    createdAt () {
      if (typeof this.promotion.createdAt === 'undefined') {
        return ''
      }
      return date.formatDate(this.promotion.createdAt, 'DD/MM/YYYY HH:mm:ss')
    },
    updatedAt () {
      if (typeof this.promotion.updatedAt === 'undefined') {
        return ''
      }
      return date.formatDate(this.promotion.updatedAt, 'DD/MM/YYYY HH:mm:ss')
    },
    name: {
      get () {
        if (typeof this.promotion.name === 'undefined') {
          return ''
        }
        return this.promotion.name
      },
      set (name) {
        if (name !== this.value.name) this.data.name = name
        else delete this.data.name
        this.promotion.name = name
      }
    },
    code: {
      get () {
        if (typeof this.promotion.code === 'undefined') {
          return ''
        }
        return this.promotion.code
      },
      set (code) {
        if (code !== this.value.code) this.data.code = code
        else delete this.data.code
        this.promotion.code = code
      }
    },
    start: {
      get () {
        if (typeof this.promotion.start === 'undefined') {
          return ''
        }
        return date.formatDate(this.promotion.start, 'DD-MMM-YYYY hh:mm A')
      },
      set (start) {
        if (start !== this.value.code) this.data.code = start
        else delete this.data.start
        this.promotion.start = start
      }
    },
    end: {
      get () {
        if (typeof this.promotion.end === 'undefined') {
          return ''
        }
        return date.formatDate(this.promotion.end, 'DD-MMM-YYYY hh:mm A')
      },
      set (end) {
        if (end !== this.value.end) this.data.end = end
        else delete this.data.end
        this.promotion.end = end
      }
    },
    content: {
      get () {
        if (typeof this.promotion.content === 'undefined') {
          return ''
        }
        return this.promotion.content
      },
      set (content) {
        if (content !== this.value.content) this.data.code = content
        else delete this.data.content
        this.promotion.content = content
      }
    },
    category: {
      get () {
        if (typeof this.promotion.category === 'undefined') {
          return ''
        }
        return this.promotion.category
      },
      set (category) {
        if (category !== this.value.category) this.data.category = category
        else delete this.data.content
        this.promotion.content = category
      }
    }
  },
  watch: {
    value (newVal) {
      this.promotion = { ...this.value }
    }
  },
  methods: {
    clear () {
      this.promotion = { ...this.value } // revert changes
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
