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
            v-show="!editable"
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
            v-if="editable"
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
            v-if="editable"
            icon="done"
            color="teal"
            size="0.75em"
            flat
            dense
            round
            :aria-label="$t('app.save')"
            @click.stop="update"
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
              v-model="model.code"
              class="col-12"
              dense
              standout="bg-secondary"
              input-class="text-black"
              :label="$t('promo.code')"
              :readonly="!editable"
              :borderless="!editable"
              type="text"
              maxlength="10"
              :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 10 || $t('app.rules.max_length', { count: 10 }) ]"
              hide-bottom-space
            />
          </div>
          <q-input
            v-model="model.name"
            dense
            standout="bg-secondary"
            input-class="text-black"
            :label="$t('promo.name')"
            :readonly="!editable"
            :borderless="!editable"
            type="text"
            maxlength="40"
            :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
            hide-bottom-space
          />
          <div class="row q-col-gutter-xs">
            <h-datetime
              v-model="model.start"
              dense
              raw
              class="col-xs-12"
              standout="bg-secondary"
              input-class="text-black"
              :label="$t('promo.start')"
              :readonly="!editable"
              :borderless="!editable"
              hide-bottom-space
              mask="DD-MMM-YYYY hh:mm A"
              :rules="[ val => !!val || $t('app.rules.required')]"
            />
            <h-datetime
              v-model="model.end"
              dense
              raw
              class="col-xs-12"
              standout="bg-secondary"
              input-class="text-black"
              :label="$t('promo.end')"
              :readonly="!editable"
              :borderless="!editable"
              hide-bottom-space
              mask="DD-MMM-YYYY hh:mm A"
              :rules="[
                val => !!val || $t('app.rules.required'),
                val => checkDateDiff(val, model.start) || 'Fecha de término debe ser mayor a fecha de inicio',
                val => checkDateDiff(val, Date.now()) || 'Fecha de término debe ser mayor a la fecha actual',
              ]"
            />
          </div>
          <q-field
            v-model="category"
            dense
            class="col-xs-4 col-sm-3 col-md-2"
            standout="bg-secondary"
            input-class="text-black"
            :label="$t('promo.category')"
            stack-label
            hide-bottom-space
            :readonly="!editable"
            :borderless="!editable"
            :rules="[val => val.length === 1 || $t('app.rules.required')]"
          >
            <template v-slot:control>
              <div class="row justify-start q-gutter-sm">
                <q-checkbox
                  v-for="(color, index) in $options.colors"
                  :key="index"
                  v-model="category"
                  class="col-1"
                  :val="color.val"
                  :color="color.name"
                  keep-color
                  :disable="!editable"
                />
              </div>
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
    'h-datetime': () => import('components/misc/DateTimePicker.vue')
  },
  mixins: [DataLayer],
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    forceEdit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    category: {
      get () {
        return [this.model.category]
      },
      set (value) {
        this.model.category = value[value.length - 1]
      }
    }
  },
  methods: {
    checkDateDiff (date1, date2) {
      return date.getDateDiff(date1, date2, 'minutes') > 0
    },
    update () {
      this.validate().then(out => !out || this.updateModel())
    },
    validate () {
      return this.$refs.form.validate(true)
    },
    getModel () {
      return this.model
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
