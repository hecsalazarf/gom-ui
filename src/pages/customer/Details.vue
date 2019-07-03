<template>
  <q-page padding>
    <h-customer-card :value="customer" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')
import CustomerDetails from 'src/graphql/queries/CustomerDetails.gql'
import { QSpinnerBars } from 'quasar'

export default {
  name: 'CustomerDetailsPage',
  components: {
    'h-customer-card': () => import('components/customer/Card.vue')
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
          return {
            id: data.bp.uid,
            name1: data.bp.name1,
            lastName1: data.bp.lastName1,
            phone: data.bp.phone,
            email: data.bp.email
          }
        },
        watchLoading (isLoading, countModifier) {
          if (isLoading) this.$q.loading.show({ spinner: QSpinnerBars })
          else this.$q.loading.hide()
        },
        variables () {
          return {
            id: this.id
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
