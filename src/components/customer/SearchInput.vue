<template>
  <q-select
    v-model="selected"
    standout
    dense
    use-input
    hide-selected
    hide-bottom-space
    hide-dropdown-icon
    input-class="text-black"
    fill-input
    clearable
    :label="$tc('customer.label', 1)"
    popup-content-style="max-height: 60vh"
    :options="options"
    :rules="[ val => val && Object.entries(val).length > 0 || $t('customer.rules.pick_customer') ]"
    @input="$emit('input', $event)"
    @filter="filter"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('app.no_results') }}
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:prepend>
      <q-icon name="contacts" />
    </template>

    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
          <q-item-label caption>
            {{ scope.opt.phone }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import UserCustomers from 'src/graphql/queries/UserCustomers.gql'
import { Auth } from 'src/helpers'

export default {
  name: 'HCustomerSearchInput',
  data () {
    return {
      selected: null,
      options: []
    }
  },
  watch: {
    selected (value) {
      this.$emit('change', value)
    }
  },
  methods: {
    mapOptions (options) {
      return options.map(el => {
        let fullName
        if (el.node.lastName1 === '' || !el.node.lastName1) fullName = el.node.name1
        else fullName = `${el.node.name1} ${el.node.lastName1}`
        return {
          value: el.node.uid,
          label: fullName,
          phone: el.node.phone
        }
      })
    },
    filter (val, done, abort) {
      const value = val.toLowerCase()
      this.$apollo
        .query({
          query: UserCustomers,
          variables: {
            where: {
              customerOf_some: {
                extUid: Auth.userId
              }
            },
            first: 20, // TODO Implement pagination
            skip: 0,
            orderBy: 'createdAt_DESC'
          }
        })
        .then(({ data }) => {
          if (value === '') {
            done(() => {
              let customers = data.bpsConnection.edges
              customers.sort((first, second) => {
                if (first.node.name1 < second.node.name1) return -1
                if (first.node.name1 > second.node.name1) return 1
                return 0
              })
              this.options = this.mapOptions(customers)
            })
            return
          }
          // Filter values
          done(() => {
            const filtered = data.bpsConnection.edges.filter(customer => {
              if (customer.node.name1 && customer.node.name1.toLowerCase().includes(value)) {
                return true
              }
              if (customer.node.lastName1 && customer.node.lastName1.toLowerCase().includes(value)) {
                return true
              }
              if (customer.node.phone && customer.node.phone.includes(value)) {
                return true
              }
              return false
            })
            this.options = this.mapOptions(filtered)
          })
        })
        .catch(() => {
          abort()
        })
    }
  }
}
</script>

<style>
</style>
