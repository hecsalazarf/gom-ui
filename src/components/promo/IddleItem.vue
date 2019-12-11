<template>
  <div>
    <q-item
      v-ripple
      v-touch-hold.mouse="handleHold"
      clickable
      active-class="bg-teal-1 text-grey-8"
      @click="handleClick"
    >
      <q-item-section>
        <q-item-label class="text-body1 text-weight-medium">
          {{ value.name }}
        </q-item-label>
        <q-item-label
          class="text-body2 text-weight-light"
          lines="1"
        >
          {{ value.code }}
        </q-item-label>
      </q-item-section>

      <q-item-section
        side
      >
        <q-item-label>{{ "14/11/2019" }}</q-item-label>
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
import { debounce } from 'quasar'
import { RouteNames } from 'src/constants/app'

export default {
  name: 'HIddlePromoItem',
  props: {
    value: {
      type: Object,
      default: () => {},
      required: false
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
  },
  watch: {
  },
  methods: {
    handleHold ({ evt, ...info }) {
      // this.$refs.selectionEl.toggle() // SELECTION DISABLED (#28)
    },
    handleClick: debounce(function (evt) {
      this.$router.push({ name: this.$options.routes.promoDetails, params: { id: this.value.id } })
    }, 200)
  },
  routes: {
    promoDetails: RouteNames.PROMO_DETAILS
  }
}
</script>

<style>
</style>
