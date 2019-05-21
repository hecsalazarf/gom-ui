<template>
  <q-page-container class="no-padding">
    <!-- This is where pages get injected -->
    <router-view ref="orders" @toolbar="changeToolbar('h-selection-toolbar', $event)" @selected="setToolbarProps('h-selection-toolbar', $event)"/>
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
      this.dispatchViewEvent({ method: 'changeToolbar', params: { name: toolbar, show: active } })
    },
    setToolbarProps (toolbar, props) {
      this.dispatchViewEvent({ method: 'setToolbarProps', params: { name: toolbar, props: props } })
    }
  }
}
</script>
