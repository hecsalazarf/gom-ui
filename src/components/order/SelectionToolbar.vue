<template>
  <q-toolbar class="bg-blue-6">
    <q-btn
      icon="arrow_back_ios"
      flat
      dense
      @click="$emit('action', { method: 'unselectAll', params: {} })"
    />
    <q-avatar>
      <q-circular-progress
        show-value
        :max="maxCount"
        font-size="0.5em"
        :value="countValue"
        size="2em"
        :thickness="0.2"
        color="accent"
        track-color="grey-3"
      />
    </q-avatar>
    <q-toolbar-title class="text-subtitle1 text-weight-regular"/>
    <div class="q-gutter-x-sm">
      <q-btn flat dense icon="check_circle"/>
      <q-btn flat dense icon="input"/>
      <q-btn flat dense icon="cancel_presentation"/>
      <q-btn flat dense icon="more_horiz">
        <q-menu>
          <q-list dense>
            <q-item
              v-show="countValue < maxCount"
              clickable
              v-close-popup
              @click="$emit('action', { method: 'selectAll', params: {} })"
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
// import { colors } from 'quasar'
export default {
  name: 'OrderSelectionToolbar',
  props: {
    count: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {}
  },
  computed: {
    maxCount () {
      return this.max
    },
    countValue () {
      return this.count
    }
  },
  created () {
    this.$q.addressbarColor.set('#2196f3') // change address bar color accordingly
  },
  beforeDestroy () {
    this.$q.addressbarColor.set() // back to default color
  }
}
</script>

<style>
</style>
