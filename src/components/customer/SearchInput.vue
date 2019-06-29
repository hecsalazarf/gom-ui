<template>
  <q-select
    standout
    dense
    use-input
    hide-selected
    input-class="text-black"
    fill-input
    clearable
    label="Cliente"
    dropdown-icon=""
    popup-content-style="max-height: 60vh"
    @filter="filterFn"
    v-model="model"
    :options="options"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">Sin resultados</q-item-section>
      </q-item>
    </template>

    <template v-slot:prepend>
      <q-icon name="contacts"/>
    </template>
  </q-select>
</template>

<script>
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle', 'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle', 'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
export default {
  name: 'HCustomerSearchInput',
  data () {
    return {
      model: null,
      options: stringOptions
    }
  },

  methods: {
    filterFn (val, update, abort) {
      if (val === '') {
        update(() => {
          this.options = stringOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>

<style>
</style>
