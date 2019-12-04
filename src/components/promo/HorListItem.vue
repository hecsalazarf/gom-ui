<template>
  <q-card class="h-rounded-borders-20 q-ma-sm active-promo-card">
    <q-card-section class="row q-pb-sm">
      <div class="col-10">
        <div class="column">
          <div class="text-body1 text-weight-medium">
            {{ value.name }}
          </div>
          <div>
            <q-badge
              outline
              align="middle"
              color="primary"
            >
              {{ value.code }}
            </q-badge>
          </div>
        </div>
      </div>
      <div class="col-2">
        <q-icon
          name="bookmark"
          size="2em"
          :color="value.color"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="row q-gutter-y-sm q-pt-sm">
      <div class="col-2 text-caption">
        <q-icon
          name="calendar_today"
          color="primary"
          size="1.5em"
        />
      </div>
      <div class="col-10 text-caption">
        {{ "14/11/2019" }}
      </div>
      <div class="col-2 text-caption">
        <q-icon
          name="date_range"
          color="primary"
          size="1.5em"
        />
      </div>
      <div class="col-10 text-caption">
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
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style scoped lang="stylus">
.active-promo-card
  max-height: 150px
  max-width: 180px
</style>
