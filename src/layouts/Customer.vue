<template>
  <q-page-container class="no-padding">
    <!-- This is where pages get injected -->
    <transition
      mode="out-in"
      :leave-active-class="leaveActiveClass"
      :enter-active-class="enterActiveClass"
    >
      <router-view
        style="animation-duration: 100ms;"
      />
    </transition>
  </q-page-container>
</template>

<script>
export default {
  name: 'CustomerLayout',
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
