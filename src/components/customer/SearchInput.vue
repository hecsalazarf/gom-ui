<template>
  <q-select
    standout
    dense
    use-input
    hide-selected
    hide-bottom-space
    hide-dropdown-icon
    input-class="text-black"
    fill-input
    clearable
    label="Cliente"
    popup-content-style="max-height: 60vh"
    @input="$emit('input', $event)"
    @filter="filter"
    v-model="selected"
    :options="options"
    :rules="[ val => val && Object.entries(val).length > 0 || 'Selecciona a un cliente' ]"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">Sin resultados</q-item-section>
      </q-item>
    </template>

    <template v-slot:prepend>
      <q-icon name="contacts"/>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
          <q-item-label caption>{{ scope.opt.phone }}</q-item-label>
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
        if (el.node.lastName1 === '') fullName = el.node.name1
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
          context: {
            headers: {
              'X-Csrf-Token': this.$q.cookies.get('csrf-token')
            }
          },
          variables: {
            id: Auth.userId
          }
        })
        .then(({ data }) => {
          if (value === '') {
            done(() => {
              let customers = data.user.customers.edges
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
            const filtered = data.user.customers.edges.filter(customer => {
              if (customer.node.name1.toLowerCase().includes(value)) {
                return true
              }
              if (customer.node.lastName1.toLowerCase().includes(value)) {
                return true
              }
              if (customer.node.phone.includes(value)) {
                return true
              }
              return false
            })
            this.options = this.mapOptions(filtered)
          })
        })
        .catch(err => {
          console.error(err)
          abort()
          this.$q.notify({
            color: 'negative',
            message: ':( No pudimos encontrar clientes',
            icon: 'report_problem'
          })
        })
    }
  }
}
</script>

<style>
</style>
