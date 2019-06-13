<template>
  <q-card bordered flat>
    <q-form @submit="save()" @reset="clear()">
      <q-item dense class="q-gutter-y-xs">
        <q-item-section class="q-gutter-y-xs">
          <q-input
            input-class="text-subtitle1 text-weight-medium text-black"
            standout="bg-blue-1"
            dense
            v-model="description"
            :readonly="!editMode"
            :borderless="!editMode"
          />
          <q-input
            input-class="text-caption text-black"
            standout="bg-blue-1"
            dense
            v-model="code"
            :readonly="!editMode"
            :borderless="!editMode"
          />
        </q-item-section>
        <q-item-section side>
          <div class="row q-gutter-x-md">
            <q-btn
              icon="edit"
              color="primary"
              size="0.75em"
              flat
              dense
              round
              v-show="!editMode"
              @click.stop="editMode = true"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              color="primary"
              size="0.75em"
              flat
              dense
              round
              v-show="!editMode"
              @click.stop="confirmDelete()"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
            <q-btn
              icon="clear"
              color="red"
              size="0.75em"
              flat
              dense
              round
              type="reset"
              v-if="editMode"
            >
              <q-tooltip>Cancelar</q-tooltip>
            </q-btn>
            <q-btn
              icon="done"
              color="teal"
              size="0.75em"
              flat
              dense
              round
              type="submit"
              v-if="editMode"
            >
              <q-tooltip>Guardar</q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
      <q-separator inset class="q-mt-xs"/>
      <q-item>
        <q-item-section class="q-gutter-y-xs">
          <q-input
            standout="bg-blue-1"
            input-class="text-black"
            dense
            label="Precio"
            v-model="price"
            :readonly="!editMode"
            :borderless="!editMode"
          >
            <template v-slot:prepend>
              <q-icon name="monetization_on" color="primary"/>
            </template>
          </q-input>
          <q-input
            standout="bg-blue-1"
            input-class="text-black"
            dense
            label="Cantidad"
            v-model="quantity"
            :readonly="!editMode"
            :borderless="!editMode"
          >
            <template v-slot:prepend>
              <q-icon name="format_list_numbered" color="primary"/>
            </template>
          </q-input>
          <q-input
            standout="bg-blue-1"
            input-class="text-black"
            dense
            label="Marca"
            v-model="provider"
            :readonly="!editMode"
            :borderless="!editMode"
          >
            <template v-slot:prepend>
              <q-icon name="stars" color="primary"/>
            </template>
          </q-input>
        </q-item-section>
      </q-item>
    </q-form>
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
      editMode: false
    }
  },
  methods: {
    deleteIt () {
      console.log('delete')
    },
    clear () {
      console.log('clear')
      this.editMode = false
    },
    save () {
      console.log('save')
      this.editMode = false
    },
    confirmDelete () {
      this.$q
        .dialog({
          title: `Esto borrará ${this.description}`,
          message: '¿Continuar?',
          position: 'bottom',
          persistent: true,
          cancel: {
            label: 'No',
            color: 'primary',
            flat: true
          },
          ok: {
            label: 'Sí',
            color: 'primary',
            flat: true
          },
          stackButtons: false,
          color: 'primary'
        })
        .onOk(() => {
          this.deleteIt()
        })
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
