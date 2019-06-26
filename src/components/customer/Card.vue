<template>
  <div class="row justify-center">
    <div class="col-12 text-center">
      <q-avatar style="z-index: 100" size="5em" text-color="white" color="primary">{{avatarText}}</q-avatar>
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
          :type="editMode || phone === '' ? '' : 'a'"
          :href="`tel:${phone}`"
          :disable="editMode || phone === ''"
        >
          <q-tooltip>Llamar por teléfono</q-tooltip>
        </q-btn>
        <q-btn
          icon="email"
          color="primary"
          size="1.3em"
          dense
          flat
          :type="editMode || email === '' ? '' : 'a'"
          :href="`mailto:${email}`"
          :disable="editMode || email === ''"
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
        <q-btn dense round flat icon="clear" color="red" v-if="editMode" @click="editMode = false">
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
</template>

<script>
export default {
  name: 'CustomerCard',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editMode: false,
      model: { ...this.value }
    }
  },
  watch: {
    value (val) {
      this.model = { ...val }
    }
  },
  computed: {
    fullName: {
      get () {
        if (this.model.lastName1 === '') return this.model.name1
        else return `${this.model.name1} ${this.model.lastName1}`
      },
      set (value) {
        // get splitted name and assign it to the corresponding varibale
        const fullName = value
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
        if (fullName.length === 1) {
          this.model.name1 = fullName[0] // if only one name
          this.model.lastName1 = ''
        } else {
          this.model.name1 = fullName.slice(0, fullName.length - 1).join(' ')
          this.model.lastName1 = fullName[fullName.length - 1]
        }
      }
    },
    phone: {
      get () {
        return this.model.phone ? this.model.phone : ''
      },
      set (value) {
        this.model.phone = value
      }
    },
    email: {
      get () {
        return this.model.email ? this.model.email : ''
      },
      set (value) {
        this.model.email = value
      }
    },
    avatarText () {
      return `${this.model.name1.charAt(0)}${
        this.model.lastName1 ? this.model.lastName1.charAt(0) : ''
      }`
    }
  }
}
</script>

<style>
</style>
