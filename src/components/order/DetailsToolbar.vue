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
      @click="$router.replace({ name: $options.routes.home })"
    />
    <div
      v-if="!activeOrder"
      class="col-5 text-subtitle1 text-primary"
    >
      {{ $t('order.new') }}
    </div>
    <q-avatar
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
      <!-- <q-badge
        floating
        color="teal"
      >
        {{ stage.label }}
      </q-badge> -->
    </q-avatar>
    <div
      v-if="activeOrder"
      class="column self-stretch q-ml-md items-start justify-start content-start ellipsis"
    >
      <div class="col-5 text-subtitle1 text-primary">
        {{ header.name }}
      </div>
      <div class="col text-subtitle2 text-weight-regular text-primary">
        {{ customer }}
      </div>
    </div>
    <q-space />
    <!-- <q-btn
      v-if="activeOrder"
      flat
      dense
      icon="more_horiz"
    > -->
    <!-- no-refocus to prevent input to lose focus in NewItemComponent -->
    <!-- <q-menu no-refocus>
        <q-list>
          <q-item
            v-if="activeOrderTab === 'items'"
            v-close-popup
            clickable
            @click="emitEvent({target: 'HOrderDetails', method: 'addItem'})"
          >
            <q-item-section class="text-body2">
              Agregar artículo
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn> -->
  </q-toolbar>
</template>

<script>
import OrderDetails from 'src/graphql/queries/OrderDetails.gql'
import { OrderComponentMixin } from './common'
import { RouteNames } from 'src/constants/app'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'OrderToolbar',
  components: {
    'h-icon': () => import('components/misc/Icon.vue')
  },
  mixins: [OrderComponentMixin],
  data () {
    return {
      header: {},
      subscription: null
    }
  },
  computed: {
    stage () {
      return this.getStatusProps(this.header.stage)
    },
    customer () {
      let name
      if (this.header.customer) {
        const name1 = this.header.customer.name1
          ? this.header.customer.name1
          : ''
        const name2 = this.header.customer.name2
          ? this.header.customer.name2
          : ''
        const lastName1 = this.header.customer.lastName1
          ? this.header.customer.lastName1
          : ''
        const lastName2 = this.header.customer.lastName2
          ? this.header.customer.lastName2
          : ''
        name = `${name1} ${name2} ${lastName1} ${lastName2}`.replace(
          /\s+/g,
          ' '
        )
      } else {
        name = ''
      }

      return name
    },
    ...mapGetters(['activeOrder', 'activeOrderTab'])
  },
  beforeMount () {
    if (this.activeOrder) {
      this.subscription = this.$apollo
        .watchQuery({
          query: OrderDetails,
          variables: {
            where: {
              uid: this.activeOrder
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
    updateHeader ({ data: { order } }) {
      if (order) {
        this.header = (({ name, stage, issuedTo }) => ({
          name,
          stage,
          customer: issuedTo
        }))(order)
      }
    },
    ...mapActions(['emitEvent'])
  },
  routes: {
    home: RouteNames.HOME
  }
}
</script>

<style>
</style>
