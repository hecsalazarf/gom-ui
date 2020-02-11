<template>
  <q-expansion-item
    class="bg-secondary h-rounded-borders-20"
    default-opened
    switch-toggle-side
    header-class="text-subtitle1 text-weight-medium text-primary"
  >
    <template v-slot:header>
      <q-item-section>{{ $t('promo.review') }}</q-item-section>
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
      </q-item-section>
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
</template>

<script>
import { date } from 'quasar'
import DataLayer from './dataLayer'

export default {
  name: 'PromoGeneralData',
  components: {
    'h-color': () => import('components/promo/ColorPickButton.vue'),
    'h-datetime': () => import('components/misc/DateTimePicker.vue')
  },
  mixins: [DataLayer],
  props: {
    value: {
      type: Object,
      default: () => ({}),
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    name: {
      get () {
        if (typeof this.model.name === 'undefined') {
          return ''
        }
        return this.model.name
      },
      set (name) {
        if (name !== this.value.name) this.tempModel.name = name
        else delete this.tempModel.name
        this.model.name = name
      }
    },
    code: {
      get () {
        if (typeof this.model.code === 'undefined') {
          return ''
        }
        return this.model.code
      },
      set (code) {
        if (code !== this.value.code) this.tempModel.code = code
        else delete this.tempModel.code
        this.model.code = code
      }
    },
    start: {
      get () {
        if (typeof this.model.start === 'undefined') {
          return ''
        }
        return date.formatDate(this.model.start, 'DD-MMM-YYYY hh:mm A')
      },
      set (start) {
        if (start !== this.value.code) this.tempModel.code = start
        else delete this.tempModel.start
        this.model.start = start
      }
    },
    end: {
      get () {
        if (typeof this.model.end === 'undefined') {
          return ''
        }
        return date.formatDate(this.model.end, 'DD-MMM-YYYY hh:mm A')
      },
      set (end) {
        if (end !== this.value.end) this.tempModel.end = end
        else delete this.tempModel.end
        this.model.end = end
      }
    },
    category: {
      get () {
        if (typeof this.model.category === 'undefined') {
          return ''
        }
        return this.model.category
      },
      set (category) {
        if (category !== this.value.category) this.tempModel.category = category
        else delete this.tempModel.content
        this.model.content = category
      }
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
