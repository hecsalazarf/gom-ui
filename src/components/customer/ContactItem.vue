<template>
  <div>
    <q-slide-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">{{value.charName}}</q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle1">{{value.name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-slide-item>
    <q-separator v-if="separator"/>
  </div>
</template>

<script>
export default {
  name: 'HContactItem',
  props: {
    separator: {
      type: Boolean,
      default: false
    },
    'avatar-char': {
      type: String,
      default: 'AC'
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  computed: {
  }
}
</script>

<style scoped lang="stylus">
 /deep/ .q-slide-item__content
    background: transparent //overrides default white color

  /deep/ .q-slide-item__right
    border-top-right-radius: 20px //overrides no-border style
    border-top-left-radius: 20px
</style>
