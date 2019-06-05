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
  props: {
    value: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    code () {
      return this.value.code
    },
    quantity () {
      return this.value.quantity
    },
    description () {
      return this.value.description
    },
    provider () {
      return this.value.provider
    },
    price () {
      return this.value.price
    }
  }
}
</script>

<style>
</style>
