<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-xs-12 col-sm-8 col-md-6 col-6">
        <h-customer-card :value="customer" />
        <h-share-link
          :value="customer.extUid"
          style="transform: translate(0, -15px);"
        />
      </div>
    </div>
    <q-dialog
      ref="dialog"
      class=" full-width"
      position="bottom"
      seamless
      auto-close
    >
      <q-banner
        inline-actions
        rounded
        class="bg-warning text-white full-width"
      >
        {{ $t('customer.rules.with_active_orders') }}

        <template v-slot:action>
          <q-btn
            flat
            round
            dense
            icon="close"
          />
        </template>
      </q-banner>
    </q-dialog>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ActionSubscribe } from 'components/actionSubscribe'
import CustomerDetails from 'src/graphql/queries/CustomerDetails.gql'
import UserCustomers from 'src/graphql/queries/UserCustomers.gql'
import DeleteBp from 'src/graphql/mutations/DeleteBp.gql'

const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'CustomerDetailsPage',
  components: {
    'h-customer-card': () => import('components/customer/Card.vue'),
    'h-share-link': () => import('components/customer/ShareLink.vue')
  },
  mixins: [ ActionSubscribe ],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      customer: {
        uid: '',
        extUid: '',
        name1: '',
        lastName1: '',
        phone: '',
        email: ''
      }
    }
  },
  created () {
    this.changeActiveCustomer(this.id) // change active customer
    this.changeActiveToolbar('h-customer-toolbar') // change toolbar
  },
  methods: {
    delete () {
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: DeleteBp,
        variables: {
          where: {
            uid: this.id
          }
        },
        // refetchQueries: [ // TODO: Find a better approach
        //   { query: UserOrders }
        // ],
        update: this.updateCacheOnDelete
      })
        .then(res => {
          this.$router.replace({ name: 'customers' })
        })
        .catch(err => {
          if (err.graphQLErrors && err.graphQLErrors.length > 0) {
            const bpWithActiveOrders = err.graphQLErrors.find(e => e.extensions.code === 'BP_WITH_ACTIVE_ORDERS')
            if (bpWithActiveOrders) {
              this.$refs.dialog.show()
            }
          }
        })
        .finally(() => this.$q.loading.hide())
    },
    updateCacheOnDelete (cache, { data }) {
      try {
        const cached = cache.readQuery({
          query: UserCustomers,
          variables: {
            where: {
              customerOf_some: {
                extUid: this.$user.id
              }
            }
          }
        })
        const index = cached.bpsConnection.edges.findIndex(edge => edge.node.uid === data.deleteBp.uid)
        if (index > -1) {
          cached.bpsConnection.edges.splice(index, 1)
          // Update orders cache
          cache.writeQuery({
            query: UserCustomers,
            variables: {
              where: {
                customerOf_some: {
                  extUid: this.$user.id
                }
              }
            },
            data: cached
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    ...mapActions(['changeActiveToolbar', 'changeActiveCustomer'])
  },
  apollo: {
    customer () {
      return {
        query: CustomerDetails,
        update (data) {
          if (typeof data.bp === 'undefined' || !data.bp) {
            // if no data is availabe, back to previous page
            this.$router.back()
            return {}
          }

          return {
            id: data.bp.uid,
            extUid: data.bp.extUid,
            name1: data.bp.name1,
            lastName1: data.bp.lastName1,
            phone: data.bp.phone,
            email: data.bp.email
          }
        },
        watchLoading (isLoading, countModifier) {
          if (isLoading) this.$q.loading.show()
          else this.$q.loading.hide()
        },
        variables () {
          return {
            where: {
              uid: this.id
            }
          }
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.changeActiveToolbar(null)
    next()
  }
}
</script>

<style scoped lang="stylus"></style>
