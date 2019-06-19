<template>
  <div class="row no-wrap items-center full-width">
    <q-input
      input-class="h-filter-input"
      class="full-width"
      color="primary"
      v-model="termFilter"
      dense
      debounce="500"
      clearable
      clear-icon="clear"
      :disable="isDisabled"
    />
    <q-btn :disable="isDisabled" dense :flat="!activeFilters" :outline="activeFilters" icon="filter_list" color="primary">
      <q-menu>
        <q-list dense>
          <q-item>
            <q-item-section class="text-weight-medium">Filtrar por</q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section top>
              <q-toggle
                v-model="statusFilters"
                val="OPEN"
                checked-icon="input"
                color="cyan-5"
                unchecked-icon="clear"
                label="Nuevo"
              />
            </q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section top>
              <q-toggle
                v-model="statusFilters"
                val="WON"
                checked-icon="check"
                color="positive"
                unchecked-icon="clear"
                label="Entregado"
              />
            </q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section top>
              <q-toggle
                v-model="statusFilters"
                val="CLOSED"
                checked-icon="cancel_presentation"
                color="negative"
                unchecked-icon="clear"
                label="Cancelado"
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
  // name: 'ComponentName',
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
  computed: {
    activeFilters () {
      return this.statusFilters.length > 0
    },
    isDisabled () {
      return this.disable
    }
  }
}
</script>

<style scoped lang="stylus">
/deep/ .h-filter-input
  color: $primary
</style>
