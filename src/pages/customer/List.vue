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
    <can
      do="create"
      on="bp"
    >
      <!--
        User is restricted to create 30 customers at maximum. This is a
        hard-coded temporary rule as we release the first beta.
        IT IS NOT THE FINAL SOLUTION AT ALL
      -->
      <q-page-sticky
        v-if="customers.length < 30"
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
    </can>
  </q-page>
</template>

<script>
import UserCustomers from 'src/graphql/queries/UserCustomers.gql'

export default {
  name: 'CustomerListPage',
  components: {
    'h-contact-group': () => import('components/customer/ContactGroup.vue'),
    'h-new-customer': () => import('components/customer/NewCustomer.vue')
  },
  props: {},
  data () {
    return {
      customers: []
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
        update (data) {
          if (typeof data.bpsConnection === 'undefined' || !data.bpsConnection.edges) {
            // If no customer, return an empty array
            return []
          }
          this.customers = data.bpsConnection.edges
          this.customers.sort((first, second) => {
            if (first.node.name1 < second.node.name1) return -1
            if (first.node.name1 > second.node.name1) return 1
            return 0
          })
          return this.customers.reduce((acc, { node }) => {
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
        variables: {
          where: {
            customerOf_some: {
              extUid: this.$user.id
            }
          },
          first: 30, // TODO Implement pagination
          skip: 0,
          orderBy: 'createdAt_DESC'
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$can('read', 'bps')) { // check permission
        vm.$router.back() // no permission, go back
      }
    })
  }
}
</script>

<style scoped lang="stylus">
.new-customer-dialog
  width: 50vw
</style>
