<template>
  <q-card bordered flat>
    <q-list bordered class="rounded-borders">
       <q-expansion-item
        expand-separator
        icon="assistant_photo"
        label="Resumen"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card>
          <q-card-section>
            <q-input dense label="Nombre del pedido" v-model="name" readonly borderless></q-input>
            <q-select dense borderless label="Estado" v-model="status" :options="statusOptions">
            </q-select>
            <q-input dense label="Total" v-model="totalAmount" readonly borderless></q-input>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="perm_identity"
        label="Cliente"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card>
          <q-card-section>
            <q-input dense label="Nombre" v-model="customer" readonly borderless></q-input>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="date_range"
        label="Fechas"
        default-opened
        header-class="text-subtitle1 text-weight-medium text-primary"
      >
        <q-card>
          <q-card-section>
            <q-input dense label="Pedido el" readonly borderless v-model="createdAt"></q-input>
          </q-card-section>
          <q-card-section>
            <q-input dense label="Actualizado el" readonly borderless v-model="updatedAt"></q-input>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-card>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'HOrderDetailsTab',
  props: {
    value: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      openItem: true,
      statusOptions: [
        { label: 'Nuevo', value: 'OPEN', icon: 'check' },
        { label: 'Entregado', value: 'WON', icon: 'check' },
        { label: 'Cancelado', value: 'CLOSED', icon: 'cancel_presentation' },
        { label: 'En Proceso', value: 'IN_PROCESS', icon: 'input' }
      ]
    }
  },
  computed: {
    customer () {
      const name1 = this.value.customer.name1 ? this.value.customer.name1 : ''
      const name2 = this.value.customer.name2 ? this.value.customer.name2 : ''
      const lastName1 = this.value.customer.lastName1 ? this.value.customer.lastName1 : ''
      const lastName2 = this.value.customer.lastName2 ? this.value.customer.lastName2 : ''
      return `${name1} ${name2} ${lastName1} ${lastName2}`.replace(/\s+/g, ' ')
    },
    createdAt () {
      return date.formatDate(this.value.createdAt, 'DD/MM/YYYY HH:mm:ss')
    },
    updatedAt () {
      return date.formatDate(this.value.updatedAt, 'DD/MM/YYYY HH:mm:ss')
    },
    totalAmount () {
      return this.value.items.reduce((acc, item) => acc + item.data.price, 0)
    },
    status () {
      return this.statusOptions.find(status => status.value === this.value.stage)
    },
    name () {
      return this.value.name
    }
  }
}
</script>

<style>
</style>
