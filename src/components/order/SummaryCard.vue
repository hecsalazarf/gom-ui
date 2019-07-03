<template>
  <q-card class="q-ma-xs bg-blue-1 h-rounded-borders-20">
    <q-card-section class="column items-center">
      <div class="col text-subtitle1 text-weight-medium">
        {{ value.name }}
      </div>
      <div class="col">
        para
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
      <div class="col-6 text-h6 text-center">
        $
        <span>{{ totalAmount }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'HCustomerSummaryCard',
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
        (acc, item) => acc + item.data.price.amount,
        0
      )
    }
  }
}
</script>

<style>
</style>
