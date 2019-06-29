<template>
  <q-card class="q-ma-xs bg-blue-1 h-rounded-borders-20">
    <q-card-section class="column items-center">
      <div class="col text-subtitle1 text-weight-medium">Nombre del pedido</div>
      <div class="col">
        para
        <span class="text-italic">Nombre del Cliente</span>
      </div>
    </q-card-section>
    <q-card-section class="row items-center justify-center">
      <div class="col-6">
        <ul class="no-margin q-pl-md">
          <li class="text-weight-light text-subtitle1">
            1
            <span>Lapiz</span>
          </li>
          <li class="text-weight-light text-subtitle1">
            1
            <span>Lapiz</span>
          </li>
        </ul>
      </div>
      <div class="col-6 text-h6 text-center">
        $
        <span>201.36</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'HCustomerSummaryCard',
  data () {
    return {}
  }
}
</script>

<style>
</style>
