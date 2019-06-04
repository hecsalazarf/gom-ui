<template>
  <div>
    <q-item clickable @click="handleClick($event)" v-touch-hold.mouse="handleHold" :active="isActive" active-class="bg-teal-1 text-grey-8">
      <q-item-section side top v-show="selectionMode">
        <q-checkbox ref="selectionEl" v-model="isSelected" :val="value.id" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-body1 text-weight-medium">{{value.customer}}</q-item-label>
        <q-item-label class="text-body2 text-weight-light" lines="1">{{value.item}}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label>{{this.createdAt}}</q-item-label>
        <q-icon :name="this.icon.name" :color="this.icon.color"/>
      </q-item-section>
    </q-item>
    <q-separator v-if="separator" inset spaced/>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'HListItem',
  props: {
    value: {
      type: Object,
      default: () => {},
      required: true
    },
    separator: {
      type: Boolean,
      default: true,
      required: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    selection: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleHold ({ evt, ...info }) {
      if (!this.selectionMode) {
        this.$emit('selection')
      }
      this.$refs.selectionEl.toggle()
    },
    handleClick (evt) {
      if (this.selectionMode) {
        this.$refs.selectionEl.toggle()
      } else {
        this.$router.push({ name: 'orderDetails', params: { id: this.value.id } })
      }
    }
  },
  computed: {
    createdAt () {
      const orderDate = new Date(this.value.createdAt)
      if (new Date().toDateString() === orderDate.toDateString()) {
        // if today's order, display time
        return date.formatDate(orderDate, 'hh:mm a')
      } else {
        // otherwise, display date
        return date.formatDate(orderDate, 'DD/MM/YYYY')
      }
    },
    icon () {
      let icon
      switch (this.value.stage) {
        case 'WON':
          icon = { name: 'check_circle', color: 'positive' }
          break
        case 'OPEN':
          icon = { name: 'input', color: 'cyan-5' }
          break
        case 'CLOSED':
          icon = { name: 'cancel_presentation', color: 'negative' }
          break
      }
      return icon
    },
    isSelected: {
      get () {
        return this.selected
      },
      set (value) {
        this.$emit('selected', value)
      }
    },
    isActive () {
      if (this.isSelected.includes(this.value.id)) {
        return true
      }
      return false
    },
    selectionMode () {
      return this.selection
    }
  },
  mounted () { }
}
</script>

<style>
</style>
