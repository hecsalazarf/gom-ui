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
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')
import CustomerDetails from 'src/graphql/queries/CustomerDetails.gql'

export default {
  name: 'CustomerDetailsPage',
  components: {
    'h-customer-card': () => import('components/customer/Card.vue'),
    'h-share-link': () => import('components/customer/ShareLink.vue')
  },
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
    this.changeActiveCustomer(this.id)
    this.changeActiveToolbar('h-customer-toolbar')
  },
  methods: {
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
