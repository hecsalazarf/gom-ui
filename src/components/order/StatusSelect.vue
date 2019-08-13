<template>
  <q-select
    v-model="status"
    dense
    color="red"
    standout="bg-secondary"
    :label="$t('order.status.label')"
    :options="displayedOptions"
    :readonly="readonly"
    :borderless="borderless"
    :hide-dropdown-icon="readonly"
  />
</template>

<script>
import { Engine } from 'json-rules-engine'
import { StatusMap, RestrictStatus } from 'src/rules/order'
import { OrderComponentMixin } from './common'

export default {
  name: 'HStatusSelect',
  mixins: [OrderComponentMixin],
  props: {
    value: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    borderless: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // Rules engine is instantiated with the StatusMap and RestrictRules;
      // the allowUndefinedFacts property allows to evaluate rules without
      // specifying all facts.
      rulesEngine: new Engine([...StatusMap, RestrictStatus], { allowUndefinedFacts: true }),
      options: [],
      displayedOptions: []
    }
  },
  computed: {
    status: {
      get () {
        return !this.value
          ? { value: '' } // prevents undefined errors
          : this.options.find(status => status.value === this.value)
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    status ({ value }) {
      // Every time the status changes, run the rules engine so that
      // the displayedOptions get updated
      this.rulesEngine.run({ currentStatus: value })
    }
  },
  created () {
    // initialize options as required by q-select
    this.options = Array.from(this.statusOptions.values())
    // At component init, attach method to listen to rules execution
    // on success validations. This method filters the displayedOptions.
    this.rulesEngine.on('success', this.filterStatus)
    // The first run is executed in case the status is already retrieved from API,
    // otherwise the status watch runs the rules engine again.
    this.rulesEngine.run({ currentStatus: this.status.value })
  },
  methods: {
    filterStatus (event, almanac) {
      if (event.type === 'nextStatus') {
        const next = event.params.next // get available statuses based on the current one
        const status = almanac.factMap.get('currentStatus').value // get current status
        this.displayedOptions = this.options.filter(opt => {
          return opt.value === status || next.includes(opt.value) // return all available statuses
        })
        this.displayedOptions.map(opt => {
          // Then, check if the statuses have any restriction
          const fact = {
            statusToRestrict: opt.value,
            isCustomer: this.$can('role', 'customer') // restrict status to customer
          }
          this.rulesEngine.run(fact) // run the rules engine for every status
        })
      }

      if (event.type === 'statusRestricted') {
        // When a restriction is found, remove the status from the
        // displayedOptions.
        const status = almanac.factMap.get('statusToRestrict').value
        const index = this.displayedOptions.findIndex(opt => opt.value === status)
        if (index > -1) {
          this.displayedOptions.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style>
</style>
