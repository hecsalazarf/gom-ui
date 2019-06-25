<template>
  <q-card class="h-rounded-borders-20 no-shadow">
    <q-form @submit="submit()" @reset="$emit('reset')">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">Nuevo cliente</div>
      </q-card-section>
      <q-card-section class="q-gutter-y-xs">
        <q-input
          autofocus
          input-class="text-black ellipsis"
          label="Nombre"
          standout="bg-blue-1"
          dense
          hide-bottom-space
          v-model="fullName"
          type="text"
          maxlength="40"
          :rules="[ val=> !!val || 'Campo requerido', val=> val.length <= 40 || 'Máximo 40 caracteres' ]"
        />
        <q-input
          input-class="text-black ellipsis"
          label="Teléfono"
          standout="bg-blue-1"
          dense
          hide-bottom-space
          v-model="phone"
          type="tel"
          mask="(##) #### ####"
          unmasked-value
          :rules="[ val=> !!val || 'Campo requerido', val => val.replace(/\s/g, '').length === 10 || 'Teléfono debe tener 10 dígitos']"
        />
        <q-input
          input-class="text-black ellipsis"
          label="Correo electrónico"
          standout="bg-blue-1"
          dense
          hide-bottom-space
          v-model="email"
          type="email"
          :rules="[ val=> val.length <= 256 || 'Máximo 256 caracteres' ]"
        />
      </q-card-section>
      <q-separator inset/>
      <q-card-actions align="around">
        <q-btn icon="clear" color="red" dense flat round type="reset">
          <q-tooltip>Cancelar</q-tooltip>
        </q-btn>
        <q-btn icon="done" color="teal" dense flat round type="submit">
          <q-tooltip>Guardar</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex'
// const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'HNewCustomer',
  data () {
    return {
      editMode: true,
      phone: '',
      fullName: '',
      email: ''
    }
  },
  created () {},
  methods: {
    submit () {
      console.log('submit')
      this.$emit('submit')
      // after creation
      this.$router.push({ name: 'customerDetails', params: { id: 'newid' } })
    }
  }
}
</script>

<style scoped lang="stylus"></style>
