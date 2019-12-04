<template>
  <q-card
    class="h-rounded-borders-20 q-ma-sm"
    style="max-height: 150px"
  >
    <q-card-section
      style="height: 50px"
      :class="cardColor"
    >
      <div class="text-body1 text-weight-medium">
        {{ value.name }}
      </div>
    </q-card-section>
    <q-card-section class="row q-pa-md">
      <div class="col-12 text-body2 text-weight-medium q-mt-sm">
        {{ value.code }}
      </div>
      <div class="col-12 text-caption">
        {{ "14/11/2019" }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'PromoHorListItem',
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
    cardColor () {
      return `bg-${this.value.color}`
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style>
</style>
