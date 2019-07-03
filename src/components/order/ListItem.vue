<template>
  <div>
    <q-item
      v-touch-hold.mouse="handleHold"
      clickable
      :active="isActive"
      active-class="bg-teal-1 text-grey-8"
      @click="handleClick($event)"
    >
      <q-item-section
        v-show="selectedOrders.length > 0"
        side
        top
      >
        <q-checkbox
          ref="selectionEl"
          v-model="selected"
          :val="value.id"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-body1 text-weight-medium">
          {{ value.name }}
        </q-item-label>
        <q-item-label
          class="text-body2 text-weight-light"
          lines="1"
        >
          {{ value.customer }}
        </q-item-label>
      </q-item-section>

      <q-item-section
        side
        top
      >
        <q-item-label>{{ createdAt }}</q-item-label>
        <q-icon
          :name="icon.name"
          :color="icon.color"
        />
      </q-item-section>
    </q-item>
    <q-separator
      v-if="separator"
      inset
      spaced
    />
  </div>
</template>

<script>
import { date } from 'quasar'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('GomState')

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
    }
  },
  data () {
    return {}
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
        default:
          icon = { name: 'edit', color: 'negative' } // default, not implemented
      }
      return icon
    },
    selected: {
      get () {
        return this.selectedOrders
      },
      set (values) {
        this.changeSelectedOrders(values)
      }
    },
    isActive () {
      return this.selectedOrders.includes(this.value.id)
    },
    ...mapGetters(['selectedOrders'])
  },
  watch: {
    selected (newVal) {
      if (newVal.length > 0) this.changeActiveToolbar('h-selection-toolbar')
      else this.changeActiveToolbar(null)
    }
  },
  methods: {
    handleHold ({ evt, ...info }) {
      this.$refs.selectionEl.toggle()
    },
    handleClick (evt) {
      if (this.selectedOrders.length > 0) {
        this.$refs.selectionEl.toggle()
      } else {
        this.$router.push({
          name: 'orderDetails',
          params: { id: this.value.id }
        })
      }
    },
    ...mapActions(['changeSelectedOrders', 'changeActiveToolbar'])
  }
}
</script>

<style>
</style>
