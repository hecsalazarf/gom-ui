<template>
  <q-icon>
    <i :class="[iconName, iconColor, iconSize]" />
  </q-icon>
</template>

<script>
export default {
  name: 'HIcon',
  props: {
    name: { // name from icons.styl
      type: String,
      default: ''
    },
    color: {
      type: String, // color from quasar palette
      default: ''
    },
    size: {
      type: String, // headings from quasar typography
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
    iconName () {
      return `hi-${this.name}`
    },
    iconColor () {
      return `text-${this.color}`
    },
    iconSize () {
      return `text-${this.size}`
    }
  }
}
</script>

<style>
</style>
