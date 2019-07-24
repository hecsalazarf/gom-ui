<template>
  <q-toolbar class="bg-blue-6">
    <q-btn
      icon="arrow_back_ios"
      flat
      dense
      @click="changeSelectedOrders([])"
    />
    <q-avatar>
      <q-circular-progress
        show-value
        :max="availableOrders.length"
        font-size="0.5em"
        :value="selectedOrders.length"
        size="2em"
        :thickness="0.2"
        color="accent"
        track-color="grey-3"
      />
    </q-avatar>
    <q-toolbar-title class="text-subtitle1 text-weight-regular" />
    <div class="q-gutter-x-sm">
      <q-btn
        flat
        dense
        icon="check_circle"
      />
      <q-btn
        flat
        dense
        icon="input"
      />
      <q-btn
        flat
        dense
        icon="cancel_presentation"
      />
      <q-btn
        flat
        dense
        icon="more_horiz"
      >
        <q-menu>
          <q-list dense>
            <q-item
              v-show="selectedOrders.length < availableOrders.length"
              v-close-popup
              clickable
              @click="changeSelectedOrders(availableOrders)"
            >
              <q-item-section>Seleccionar todo</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </q-toolbar>
</template>

<script>
import UserOrders from 'src/graphql/queries/UserOrders.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'OrderSelectionToolbar',
  props: {
  },
  data () {
    return {
      availableOrders: []
    }
  },
  computed: {
    ...mapGetters([
      'selectedOrders'
    ])
  },
  created () {
    this.$q.addressbarColor.set('#2196f3') // change address bar color accordingly
    this.$apollo
      .watchQuery({
        query: UserOrders,
        variables: {
          id: this.$user.id
        }
      })
      .subscribe(this.updateAvailableOrders)
  },
  beforeDestroy () {
    this.$q.addressbarColor.set() // back to default color
  },
  methods: {
    updateAvailableOrders ({ data: { user } }) {
      this.availableOrders = user.orders.edges.map(el => el.node.uid)
    },
    ...mapActions([
      'changeSelectedOrders'
    ])
  }
}
</script>

<style>
</style>
