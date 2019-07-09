<template>
  <q-select
    v-model="status"
    dense
    color="red"
    standout="bg-secondary"
    label="Estado"
    :options="options | validOptions(value, rules)"
    :readonly="readonly"
    :borderless="borderless"
    :hide-dropdown-icon="readonly"
  />
</template>

<script>
export default {
  name: 'HStatusSelect',
  filters: {
    validOptions (options, status, rules) {
      /* Filter status options so that user can only select
      the valid ones. 'rules' data prop states which are valid */
      if (status in rules) {
        return options.filter(
          opt => opt.value === status || // Always return the current status
        rules[status].includes(opt.value) // Then check that rules include the proposed option
        )
      }
      return options
    }
  },
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
      options: [
        { label: 'Nuevo', value: 'OPEN', icon: 'check' },
        { label: 'Entregado', value: 'WON', icon: 'check' },
        { label: 'Cancelado', value: 'CLOSED', icon: 'cancel_presentation' },
        { label: 'En Proceso', value: 'IN_PROCESS', icon: 'input' }
      ],
      /* Rules object works this way: When current status is
      IN_PROCESS, the user can select CLOSED and WON only */
      rules: {
        'OPEN': [ 'WON', 'CLOSED', 'IN_PROCESS' ],
        'CLOSED': [ ],
        'WON': [ ],
        'IN_PROCESS': [ 'CLOSED', 'WON' ]
      }
    }
  },
  computed: {
    status: {
      get () {
        return this.options.find(
          status => status.value === this.value
        )
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style>
</style>
