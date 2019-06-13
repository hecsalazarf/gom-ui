<template>
  <q-dialog
    persistent
    :position="$q.platform.is.mobile ? 'bottom' : 'standard'"
    v-model="isShown"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialog"
  >
    <q-card bordered flat class="q-gutter-y-sm">
      <q-form @submit="save()" @reset="cancel()" class="q-gutter-y-xs">
        <q-item dense>
          <q-item-section class="q-gutter-y-xs">
            <q-input
              input-class="text-subtitle1 text-weight-medium text-black"
              standout="bg-blue-1"
              dense
              label="Descripción"
            />
            <q-input
              input-class="text-caption text-black"
              standout="bg-blue-1"
              dense
              label="Código"
            />
          </q-item-section>
        </q-item>
        <q-separator inset/>
        <q-item>
          <q-item-section class="q-gutter-y-xs">
            <q-input standout="bg-blue-1" input-class="text-black" dense label="Precio">
              <template v-slot:prepend>
                <q-icon name="monetization_on" color="primary"/>
              </template>
            </q-input>
            <q-input dense standout="bg-blue-1" input-class="text-black" label="Cantidad">
              <template v-slot:prepend>
                <q-icon name="format_list_numbered" color="primary"/>
              </template>
            </q-input>
            <q-input dense standout="bg-blue-1" input-class="text-black" label="Marca">
              <template v-slot:prepend>
                <q-icon name="stars" color="primary"/>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-separator inset/>
        <q-card-actions align="around">
          <q-btn flat round color="red" icon="clear" type="reset">
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
          <q-btn flat round color="teal" icon="done" type="submit">
            <q-tooltip>Guardar</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'HNewItem',
  data () {
    return {
      isShown: false
    }
  },
  methods: {
    show () {
      this.isShown = true
    },
    cancel () {
      this.isShown = false
      console.log('cancelItem')
    },
    save () {
      this.isShown = false
      console.log('saveItem')
    }
  }
}
</script>

<style>
</style>
