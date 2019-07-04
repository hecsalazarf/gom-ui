<template>
  <q-page
    padding
    class="flex"
  >
    <q-list class="full-width">
      <h-contact-group
        v-for="group in groups"
        :key="group.name"
        v-model="group.contacts"
        :name="group.name"
      />
    </q-list>
    <q-dialog
      ref="newCustomer"
      persistent
      :position="$q.platform.is.mobile ? 'bottom' : 'standard'"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <h-new-customer
        class="new-customer-dialog"
        @reset="$refs.newCustomer.hide()"
      />
    </q-dialog>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        round
        color="accent"
        icon="person_add"
        class="shadow-7"
        @click="$refs.newCustomer.show()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import UserCustomers from 'src/graphql/queries/UserCustomers.gql'
import { Auth } from 'src/helpers'

export default {
  name: 'CustomerListPage',
  components: {
    'h-contact-group': () => import('components/customer/ContactGroup.vue'),
    'h-new-customer': () => import('components/customer/NewCustomer.vue')
  },
  props: {},
  data () {
    return {
    }
  },
  methods: {
    cancelD () {
      console.log('cancel')
    }
  },
  apollo: {
    groups () {
      return {
        query: UserCustomers,
        error: err => {
          console.log(err)
        },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        update (data) {
          if (Object.entries(data).length === 0) {
            return []
          }
          let customers = data.user.customers.edges
          customers.sort((first, second) => {
            if (first.node.name1 < second.node.name1) return -1
            if (first.node.name1 > second.node.name1) return 1
            return 0
          })
          return customers.reduce((acc, { node }) => {
            const groupName = node.name1.charAt(0)
            const charName = `${groupName}${node.lastName1 ? node.lastName1.charAt(0) : ''}`
            const index = acc.findIndex(el => el.name === groupName)
            const contact = {
              id: node.uid,
              charName: charName.toUpperCase(),
              name1: node.name1,
              lastName1: node.lastName1,
              phone: node.phone,
              email: node.email
            }
            if (index > -1) {
              acc[index].contacts.push({
                data: contact
              })
            } else {
              acc.push({
                name: groupName,
                contacts: [{
                  data: contact
                }]
              })
            }
            return acc
          }, [])
        },
        watchLoading (isLoading, countModifier) {
          if (isLoading) this.$q.loading.show()
          else this.$q.loading.hide()
        },
        variables () {
          return {
            id: Auth.userId
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.new-customer-dialog
  width: 50vw
</style>
