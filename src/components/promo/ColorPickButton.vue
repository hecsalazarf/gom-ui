<template>
  <q-btn
    icon="bookmark"
    flat
    round
    dense
    :size="size"
    :style="`color: ${color}`"
  >
    <q-menu
      transition-show="scale"
      transition-hide="scale"
    >
      <q-color
        v-model="color"
        v-close-popup
        square
        no-header
        no-footer
        default-view="palette"
        :palette="[
          '#f50000',
          '#f57b00',
          '#f5f500',
          '#00d600',
          '#006cd6',
          '#6c00d6',
          '#f500f5',
          '#7f7f7f',
          '#00d6d6',
          '#000000'
        ]"
      />
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  name: 'ColorPickButton',
  props: {
    value: {
      type: String,
      default: '',
      required: true
    },
    size: {
      type: String,
      default: '1em'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    color: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-color-picker /deep/ .q-tab-panels .q-panel
  min-height: 100px

/deep/ .q-color-picker__cube
  margin: 10px
  transform: scale(1.5);
  border-radius: 1em
</style>
