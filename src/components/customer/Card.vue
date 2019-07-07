<template>
  <div class="row justify-center">
    <div class="col-12 text-center">
      <q-avatar
        style="z-index: 100"
        size="5em"
        text-color="white"
        color="customers"
      >
        {{ avatarText }}
      </q-avatar>
    </div>
    <q-card
      class="col-xs-12 col-sm-8 col-md-6 col-6 no-shadow bg-secondary q-pt-lg h-rounded-borders-20 relative-position"
      style="transform: translate(0, -35px);"
    >
      <q-card-section class="row justify-center">
        <q-form
          ref="form"
          class="q-gutter-y-xs"
        >
          <q-input
            v-model="fullName"
            class="col-8"
            input-class="text-h6 text-black text-center ellipsis"
            placeholder="Nombre"
            standout="bg-secondary"
            dense
            hide-bottom-space
            :readonly="!editMode"
            :borderless="!editMode"
            type="text"
            maxlength="40"
            :rules="[ val=> !!val || 'Campo requerido', val=> val.length <= 40 || 'Máximo 40 caracteres' ]"
          />
          <q-input
            v-model="phone"
            class="col-8"
            input-class="text-subtitle1 text-black text-center ellipsis"
            placeholder="Teléfono"
            standout="bg-secondary"
            dense
            hide-bottom-space
            :borderless="!editMode"
            :readonly="!editMode"
            type="tel"
            mask="(##) #### ####"
            unmasked-value
            :rules="[ val=> !!val || 'Campo requerido', val => val.replace(/\s/g, '').length === 10 || 'Teléfono debe tener 10 dígitos']"
          />
          <q-input
            v-model="email"
            class="col-8"
            input-class="text-subtitle1 text-black text-center ellipsis"
            placeholder="Correo electrónico"
            standout="bg-secondary"
            dense
            hide-bottom-space
            :borderless="!editMode"
            :readonly="!editMode"
            type="email"
            :rules="[ val=> val.length <= 256 || 'Máximo 256 caracteres' ]"
          />
        </q-form>
      </q-card-section>
      <q-separator
        inset
        class="relative-position"
      />
      <q-card-actions align="center">
        <q-btn
          icon="phone"
          color="accent"
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
          color="accent"
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
          v-show="!editMode"
          dense
          round
          flat
          icon="edit"
          color="primary"
          @click="editMode = !editMode"
        >
          <q-tooltip>Editar</q-tooltip>
        </q-btn>
        <q-btn
          v-if="editMode"
          dense
          round
          flat
          icon="clear"
          color="red"
          @click="clear()"
        >
          <q-tooltip>Cancelar</q-tooltip>
        </q-btn>
        <q-btn
          v-if="editMode"
          dense
          round
          flat
          icon="done"
          color="teal"
          @click="$refs.form.validate(true).then(out => { if(out) save() })"
        >
          <q-tooltip>Guardar</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import UpdateCustomer from 'src/graphql/mutations/UpdateCustomer.gql'

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
      model: { ...this.value },
      data: {}
    }
  },
  computed: {
    fullName: {
      get () {
        // Turn first letter to uppercase
        if (this.model.lastName1 === '' ||
            !this.model.lastName1) { // check it's not null. Fix (#15)
          return (
            this.model.name1.charAt(0).toUpperCase() + this.model.name1.slice(1)
          )
        } else {
          return `${this.model.name1.charAt(0).toUpperCase() +
            this.model.name1.slice(1)} ${this.model.lastName1.charAt(0).toUpperCase() +
            this.model.lastName1.slice(1)}`
        }
      },
      set (value) {
        // get splitted name and assign it to the corresponding variable
        // trim white spaces
        const fullName = value
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
        if (fullName.length === 1) {
          this.model.name1 = fullName[0]
          this.model.lastName1 = ''
        } else {
          this.model.name1 = fullName.slice(0, fullName.length - 1).join(' ')
          this.model.lastName1 = fullName[fullName.length - 1]
        }

        // this avoid unnecessary saving by comparing current value to original one
        if (this.model.name1 !== this.value.name1) {
          this.data.name1 = this.model.name1
        } else delete this.data.name1

        if (this.model.lastName1 !== this.value.lastName1) {
          this.data.lastName1 = this.model.lastName1
        } else delete this.data.lastName1
      }
    },
    phone: {
      get () {
        return this.model.phone ? this.model.phone : ''
      },
      set (value) {
        this.model.phone = value
        if (value !== this.value.phone) {
          this.data.phone = value
        } else delete this.data.phone
      }
    },
    email: {
      get () {
        return this.model.email ? this.model.email : ''
      },
      set (value) {
        this.model.email = value
        if (value !== this.value.email) {
          this.data.email = value
        } else delete this.data.email
      }
    },
    avatarText () {
      return `${this.model.name1.charAt(0)}${
        this.model.lastName1 ? this.model.lastName1.charAt(0) : ''
      }`.toUpperCase() // Always in uppercase
    }
  },
  watch: {
    value (val) {
      this.model = { ...val }
    }
  },
  methods: {
    clear () {
      this.model = { ...this.value }
      this.data = {}
      this.editMode = false
    },
    save () {
      if (Object.entries(this.data).length < 1) {
        this.editMode = false
        return
      }
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: UpdateCustomer,
        variables: { id: this.value.id, data: this.data },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        }
      })
        .then(res => {
          this.editMode = false
          this.$q.loading.hide()
          this.$q.notify({
            color: 'positive',
            message: 'Cambios guardados',
            icon: 'check_circle'
          })
        })
        .catch(error => {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'No pudimos guardar los cambios :(',
            icon: 'report_problem'
          })
          if (error.graphQLErrors.length > 0) console.error(error.graphQLErrors)
          else console.log(error)
        })
    }
  }
}
</script>

<style>
</style>
