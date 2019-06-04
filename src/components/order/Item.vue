<template>
  <q-card bordered flat>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-medium">{{description}}</q-item-label>
        <q-item-label caption>{{code}}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator inset/>
    <q-item>
      <q-item-section>
        <q-input label="Precio" v-model="price" readonly borderless>
          <template v-slot:prepend>
            <q-icon name="monetization_on" color="primary"/>
          </template>
        </q-input>
        <q-input label="Cantidad" v-model="quantity" readonly borderless>
          <template v-slot:prepend>
            <q-icon name="format_list_numbered" color="primary"/>
          </template>
        </q-input>
        <q-input label="Marca" v-model="provider" readonly borderless>
          <template v-slot:prepend>
            <q-icon name="stars" color="primary"/>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
export default {
  name: 'HOrderItem',
  data () {
    return {
      code: '02255',
      description: 'Lámpara de luces led',
      price: '$50',
      quantity: 2,
      provider: 'Avon'
    }
  }
}
</script>

<style>
</style>
