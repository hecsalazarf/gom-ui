<template>
  <div>
    <q-item
      v-touch-hold.mouse="handleHold"
      clickable
      active-class="bg-teal-1 text-grey-8"
      @click="handleClick($event)"
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
export default {
  name: 'PromoListItem',
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
    handleClick (evt) {
    }
  }
}
</script>

<style>
</style>
