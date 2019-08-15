<template>
  <q-card class="q-ma-xs bg-secondary h-rounded-borders-20">
    <q-card-section class="column items-center">
      <div class="col text-subtitle1 text-weight-medium">
        {{ value.name }}
      </div>
      <!-- CASL permission -->
      <div
        v-if="$can('read', 'bp')"
        class="col"
      >
        {{ $t('app.to') }}
        <span class="text-italic">{{ value.customer.label }}</span>
      </div>
    </q-card-section>
    <q-card-section class="row items-center justify-center">
      <div class="col-6">
        <ul class="no-margin q-pl-md">
          <li
            v-for="(item, index) in value.items"
            :key="index"
            class="text-weight-light text-subtitle1"
          >
            {{ item.data.quantity }}
            <span>{{ item.data.description }}</span>
          </li>
        </ul>
      </div>
      <div
        v-if="parseFloat(totalAmount) > 0"
        class="col-6 text-h6 text-center"
      >
        $
        <span>{{ totalAmount }}</span>
      </div>
      <div
        v-else
        class="col-6"
      >
        <q-banner
          rounded
          dense
          class="bg-primary text-white"
        >
          <template v-slot:avatar>
            <q-icon name="timelapse" />
          </template>
          {{ $t('pricing.to_be_confirmed') }}
        </q-banner>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'HOrderSummaryCard',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    totalAmount () {
      return this.value.items.reduce(
        (acc, item) => acc + (item.data.price.amount * item.data.quantity),
        0).toFixed(2) // toFixed() prevents floating point inaccuracy
    }
  }
}
</script>

<style>
</style>
