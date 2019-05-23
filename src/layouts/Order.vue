<template>
  <q-page-container class="no-padding">
    <!-- This is where pages get injected -->
    <transition
      mode="out-in"
      :leave-active-class="leaveActiveClass"
      :enter-active-class="enterActiveClass"
    >
      <router-view
        ref="orders"
        style="animation-duration: 100ms;"
        @toolbar="changeToolbar('h-selection-toolbar', $event)"
        @selected="setToolbarProps('h-selection-toolbar', $event)"
      />
    </transition>
    <q-page-sticky v-if="$route.name === 'orders'" position="bottom-right" :offset="[18, 18]">
      <q-btn round color="accent" icon="add_shopping_cart"/>
    </q-page-sticky>
  </q-page-container>
</template>

<script>
export default {
  // name: 'LayoutName',
  methods: {
    dispatch ({ method, params }) {
      this.$refs.orders[method](method)
    },
    dispatchViewEvent (evt) {
      this.$emit('dispatch', evt)
    },
    changeToolbar (toolbar, active) {
      this.dispatchViewEvent({
        method: 'changeToolbar',
        params: { name: toolbar, show: active }
      })
    },
    setToolbarProps (toolbar, props) {
      this.dispatchViewEvent({
        method: 'setToolbarProps',
        params: { name: toolbar, props: props }
      })
    }
  },
  computed: {
    enterActiveClass () {
      // animate transition only on mobile devices
      return this.$q.platform.is.mobile ? 'animated slideInUp' : ''
    },
    leaveActiveClass () {
      // animate transition only on mobile devices
      return this.$q.platform.is.mobile ? 'animated slideOutUp' : ''
    }
  }
}
</script>
