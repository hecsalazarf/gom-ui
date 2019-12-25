<template>
  <q-toolbar class="bg-white">
    <!-- $router.replace({ name: 'home' }) Fix #35  -->
    <q-btn
      class="q-mr-sm"
      icon="arrow_back_ios"
      color="primary"
      flat
      dense
      :aria-label="$t('app.go_back')"
      @click="$router.replace({ name: $options.routes.promos })"
    />
    <div
      v-if="activePromo"
      class="column self-stretch items-start justify-start content-start ellipsis"
    >
      <div class="col-5 text-subtitle1 text-primary">
        {{ header.name }}
      </div>
      <div class="col text-subtitle2 text-weight-regular text-primary">
        {{ header.code }}
      </div>
    </div>
    <div
      v-else
      class="column items-start justify-start content-start ellipsis"
    >
      <div class="text-subtitle1 text-primary">
        {{ "Nueva promo" }}
      </div>
    </div>
    <q-space />
  </q-toolbar>
</template>

<script>
import { RouteNames } from 'src/constants/app'
import { createNamespacedHelpers } from 'vuex'
import PromotionDetails from 'src/graphql/queries/PromotionDetails.gql'

const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'HPromoToolbar',
  components: {
  },
  data () {
    return {
      header: {},
      subscription: null
    }
  },
  computed: {
    ...mapGetters(['activePromo'])
  },
  beforeMount () {
    if (this.activePromo) {
      this.subscription = this.$apollo
        .watchQuery({
          query: PromotionDetails,
          variables: {
            where: {
              uid: this.activePromo
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
    updateHeader ({ data: { promotion } }) {
      if (promotion) {
        this.header = (({ name, code }) => ({
          name,
          code
        }))(promotion)
      }
    },
    ...mapActions(['emitEvent'])
  },
  routes: {
    promos: RouteNames.PROMO_LIST
  }
}
</script>

<style>
</style>
