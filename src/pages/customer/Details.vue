<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <q-avatar style="z-index: 100" size="5em" text-color="white" color="primary">AS</q-avatar>
      </div>
      <q-card
        class="col-xs-12 col-sm-8 col-md-6 col-6 no-shadow bg-blue-1 q-pt-lg h-rounded-borders-20 relative-position"
        style="transform: translate(0, -35px);"
      >
        <q-card-section class="row justify-center">
          <q-form ref="form" class="q-gutter-y-xs">
            <q-input
              class="col-8"
              input-class="text-h6 text-black text-center ellipsis"
              placeholder="Nombre"
              standout="bg-blue-1"
              dense
              hide-bottom-space
              :readonly="!editMode"
              :borderless="!editMode"
              v-model="fullName"
              type="text"
              maxlength="40"
              :rules="[ val=> !!val || 'Campo requerido', val=> val.length <= 40 || 'Máximo 40 caracteres' ]"
            />
            <q-input
              class="col-8"
              input-class="text-subtitle1 text-black text-center ellipsis"
              placeholder="Teléfono"
              standout="bg-blue-1"
              dense
              hide-bottom-space
              :borderless="!editMode"
              :readonly="!editMode"
              v-model="phone"
              type="tel"
              mask="(##) #### ####"
              unmasked-value
              :rules="[ val=> !!val || 'Campo requerido', val => val.replace(/\s/g, '').length === 10 || 'Teléfono debe tener 10 dígitos']"
            />
            <q-input
              class="col-8"
              input-class="text-subtitle1 text-black text-center ellipsis"
              placeholder="Correo electrónico"
              standout="bg-blue-1"
              dense
              hide-bottom-space
              :borderless="!editMode"
              :readonly="!editMode"
              v-model="email"
              type="email"
              :rules="[ val=> val.length <= 256 || 'Máximo 256 caracteres' ]"
            />
          </q-form>
        </q-card-section>
        <q-separator inset class="relative-position"/>
        <q-card-actions align="center">
          <q-btn
            icon="phone"
            color="primary"
            size="1.3em"
            dense
            flat
            :type="editMode ? '' : 'a'"
            :href="`tel:${phone}`"
            :disable="editMode"
          >
            <q-tooltip>Llamar por teléfono</q-tooltip>
          </q-btn>
          <q-btn
            icon="email"
            color="primary"
            size="1.3em"
            dense
            flat
            :type="editMode ? '' : 'a'"
            :href="`mailto:${email}`"
            :disable="editMode"
          >
            <q-tooltip>Enviar correo</q-tooltip>
          </q-btn>
        </q-card-actions>
        <q-card-actions class="absolute-top-right">
          <q-btn
            dense
            round
            flat
            icon="edit"
            color="primary"
            v-show="!editMode"
            @click="editMode = !editMode"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            dense
            round
            flat
            icon="clear"
            color="red"
            v-if="editMode"
            @click="editMode = false"
          >
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
          <q-btn
            dense
            round
            flat
            icon="done"
            color="teal"
            v-if="editMode"
            @click="$refs.form.validate(true).then(out => { if(out) editMode = false })"
          >
            <q-tooltip>Guardar</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'CustomerDetailsPage',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      editMode: false,
      model: {
        name: 'Adriana',
        lastName: 'Sanchez',
        phone: '55 1234 5678',
        email: 'adriana@sanchez.net'
      }
    }
  },
  created () {
    this.changeActiveToolbar('h-customer-toolbar')
  },
  methods: {
    ...mapActions(['changeActiveToolbar'])
  },
  computed: {
    fullName: {
      get () {
        return `${this.model.name} ${this.model.lastName}`
      },
      set (value) {
        // get splitted name and assign it to the corresponding varibale
        const fullName = value.trim().split(' ')
        this.model.name = fullName.slice(0, fullName.length - 1).join(' ')
        this.model.lastName = fullName[fullName.length - 1]
      }
    },
    phone: {
      get () {
        return this.model.phone
      },
      set (value) {
        this.model.phone = value
      }
    },
    email: {
      get () {
        return this.model.email
      },
      set (value) {
        this.model.email = value
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.changeActiveToolbar(null)
    next()
  }
}
</script>

<style scoped lang="stylus"></style>
