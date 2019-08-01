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
    />
    <q-btn
      :disable="isDisabled"
      dense
      :flat="!activeFilters"
      :outline="activeFilters"
      icon="filter_list"
      color="primary"
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
                val="OPEN"
                checked-icon="input"
                color="cyan-5"
                unchecked-icon="clear"
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
                val="IN_PROCESS"
                checked-icon="input"
                color="amber-5"
                unchecked-icon="clear"
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
                val="WON"
                checked-icon="check"
                color="positive"
                unchecked-icon="clear"
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
                val="CLOSED"
                checked-icon="cancel_presentation"
                color="negative"
                unchecked-icon="clear"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'OrderFilterInput',
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
    }
  }
}
</script>

<style scoped lang="stylus">
/deep/ .h-filter-input
  color: $primary
</style>
