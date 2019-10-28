<template>
  <div class="row no-wrap items-center full-width">
    <q-input
      v-model="termFilter"
      input-class="h-filter-input"
      class="full-width"
      color="primary"
      dense
      debounce="500"
      clearable
      clear-icon="clear"
      :disable="isDisabled"
      :aria-label="$t('app.search')"
    />
    <q-btn
      :disable="isDisabled"
      dense
      :flat="!activeFilters"
      :outline="activeFilters"
      icon="filter_list"
      color="primary"
      :aria-label="$t('app.filter_by_status')"
    >
      <q-menu>
        <q-list dense>
          <q-item>
            <q-item-section class="text-weight-medium">
              {{ $t('app.filter_by_status') }}
            </q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section>
              {{ $t('order.status.options.OPEN.label') }}
            </q-item-section>
            <q-item-section avatar>
              <q-toggle
                v-model="statusFilters"
                :val="status.OPEN"
                :color="getStatusProps(status.OPEN).color"
              />
            </q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section>
              {{ $t('order.status.options.IN_PROCESS.label') }}
            </q-item-section>
            <q-item-section avatar>
              <q-toggle
                v-model="statusFilters"
                :val="status.IN_PROCESS"
                :color="getStatusProps(status.IN_PROCESS).color"
              />
            </q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section>
              {{ $t('order.status.options.WON.label') }}
            </q-item-section>
            <q-item-section avatar>
              <q-toggle
                v-model="statusFilters"
                :val="status.WON"
                :color="getStatusProps(status.WON).color"
              />
            </q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section>
              {{ $t('order.status.options.CLOSED.label') }}
            </q-item-section>
            <q-item-section avatar>
              <q-toggle
                v-model="statusFilters"
                :val="status.CLOSED"
                :color="getStatusProps(status.CLOSED).color"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { OrderStatus } from 'src/constants/order'
import { OrderComponentMixin } from './common'

export default {
  name: 'OrderFilterInput',
  mixins: [ OrderComponentMixin ],
  props: {
    disable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      termFilter: '',
      statusFilters: [],
      filterBy: new Map()
    }
  },
  computed: {
    activeFilters () {
      return this.statusFilters.length > 0
    },
    isDisabled () {
      return this.disable
    },
    status () {
      return OrderStatus
    }
  },
  watch: {
    statusFilters (status) {
      this.setFilter('status', status)
      this.$emit('filter', this.filterBy)
    },
    termFilter (term) {
      this.setFilter('term', term)
      this.$emit('filter', this.filterBy)
    }
  },
  methods: {
    setFilter (key, value) {
      if (!value) {
        this.filterBy.delete(key)
        return
      }
      let hasValue = false
      switch (typeof value) {
        case 'object':
          hasValue = Object.keys(value).length > 0
          break
        case 'string':
          hasValue = !!value
          value = value.toLowerCase()
          break
        case 'number':
          hasValue = true
          break
      }
      if (hasValue) {
        this.filterBy.set(key, value)
      } else {
        this.filterBy.delete(key)
      }
    },
    reset () {
      this.statusFilters = []
      this.termFilter = ''
    }
  }
}
</script>

<style scoped lang="stylus">
/deep/ .h-filter-input
  color: $primary
</style>
