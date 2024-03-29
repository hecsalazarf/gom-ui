<template>
  <q-toolbar>
    <q-btn
      class="q-mr-sm"
      icon="arrow_back_ios"
      color="primary"
      :aria-label="$t('app.go_back')"
      flat
      dense
      @click="$router.replace({ name: $options.routes.customers })"
    />
    <div class="column items-start justify-center content-start ellipsis">
      <div class="col-5 text-subtitle1 text-weight-medium text-primary">
        {{ fullName }}
      </div>
    </div>
    <q-space />
    <q-btn
      flat
      dense
      round
      color="primary"
      icon="more_vert"
      :aria-label="$t('app.options_menu')"
    >
      <q-menu>
        <q-list>
          <q-item
            v-close-popup
            clickable
            @click="confirmDelete()"
          >
            <q-item-section>
              <q-item-label class="text-body2">
                {{ $t('app.delete') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script>
import CustomerDetails from 'src/graphql/queries/CustomerDetails.gql'
import { createNamespacedHelpers } from 'vuex'
import { RouteNames } from 'src/constants/app'
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'OrderToolbar',
  data () {
    return {
      header: {
        name1: '',
        lastName1: ''
      },
      subscription: null
    }
  },
  computed: {
    fullName () {
      if (this.header.lastName1 === '' ||
        !this.header.lastName1) { // check it's not null. Fix (#15)
        return this.header.name1
      } else return `${this.header.name1} ${this.header.lastName1}`
    },
    ...mapGetters(['activeCustomer'])
  },
  beforeMount () {
    if (this.activeCustomer) {
      this.subscription = this.$apollo
        .watchQuery({
          query: CustomerDetails,
          variables: {
            where: {
              uid: this.activeCustomer
            }
          },
          fetchPolicy: 'cache-only'
        })
        .subscribe(this.updateHeader)
    }
  },
  beforeDestroy () {
    if (this.subscription) {
      // Fix #61, ckeck subscription exists before unsubscribing
      this.subscription.unsubscribe()
    }
  },
  methods: {
    updateHeader ({ data: { bp } }) {
      if (bp) {
        this.header = {
          name1: bp.name1,
          lastName1: bp.lastName1
        }
      }
    },
    confirmDelete () {
      this.$q.dialog({
        title: this.$t('app.delete_confirm', { object: this.fullName }),
        message: this.$t('app.continue_question'),
        position: 'bottom',
        persistent: true,
        cancel: {
          label: this.$t('app.no'),
          color: 'primary',
          flat: true
        },
        ok: {
          label: this.$t('app.yes'),
          color: 'primary',
          flat: true
        },
        stackButtons: false,
        color: 'primary'
      }).onOk(() => {
        this.emitEvent({
          target: 'CustomerDetailsPage',
          method: 'delete'
        })
      })
    },
    ...mapActions(['emitEvent'])
  },
  routes: {
    customers: RouteNames.CUSTOMER_LIST
  }
}
</script>

<style>
</style>
