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
    <!-- <div
      v-if="!activeOrder"
      class="col-5 text-subtitle1 text-primary"
    >
      {{ $t('order.new') }}
    </div> -->
    <!-- <q-avatar
      v-if="activeOrder"
      rounded
      size="2.5em"
      :color="stage.color"
      text-color="white"
    >
      <h-icon
        size="h5"
        :name="stage.icon"
      />
    </q-avatar> -->
    <div
      v-if="activePromo"
      class="column self-stretch q-ml-md items-start justify-start content-start ellipsis"
    >
      <div class="col-5 text-subtitle1 text-primary">
        {{ "Promo name" }}
      </div>
      <div class="col text-subtitle2 text-weight-regular text-primary">
        {{ "Promo code" }}
      </div>
    </div>
    <q-space />
  </q-toolbar>
</template>

<script>
import { RouteNames } from 'src/constants/app'
import { createNamespacedHelpers } from 'vuex'
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
    // if (this.activeOrder) {
    //   this.subscription = this.$apollo
    //     .watchQuery({
    //       query: OrderDetails,
    //       variables: {
    //         where: {
    //           uid: this.activeOrder
    //         }
    //       },
    //       fetchPolicy: 'cache-only'
    //     })
    //     .subscribe(this.updateHeader)
    // }
  },
  beforeDestroy () {
    // if (this.subscription) {
    //   // Fix #61, ckeck subscription exists before unsubscribing
    //   this.subscription.unsubscribe()
    // }
  },
  methods: {
    updateHeader ({ data: { order } }) {
      // if (order) {
      //   this.header = (({ name, stage, issuedTo }) => ({
      //     name,
      //     stage,
      //     customer: issuedTo
      //   }))(order)
      // }
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
