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
            <q-select dense borderless label="Estado" v-model="status" :options="statusOptions">
              <!-- <template v-slot:prepend>
                <q-icon :name="status.icon"/>
              </template> -->
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
  data () {
    return {
      openItem: true,
      customer: 'Juanito Perez',
      status: {},
      statusOptions: [
        { label: 'Nuevo', value: 'OPEN', icon: 'check' },
        { label: 'Entregado', value: 'WON', icon: 'check' },
        { label: 'Cancelado', value: 'CLOSED', icon: 'cancel_presentation' },
        { label: 'En Proceso', value: 'IN_PROCESS', icon: 'input' }
      ],
      createdAt: date.formatDate(new Date(), 'DD/MM/YYYY HH:mm:ss'),
      updatedAt: date.formatDate(new Date(), 'DD/MM/YYYY HH:mm:ss'),
      totalAmount: '$150'
    }
  }
}
</script>

<style>
</style>
