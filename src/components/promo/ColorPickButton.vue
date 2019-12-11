<template>
  <div class="row justify-start q-gutter-sm">
    <q-checkbox
      v-for="(color, index) in options"
      :key="index"
      v-model="model"
      class="col-1"
      :val="color.val"
      :color="color.name"
      keep-color
    />
  </div>
</template>

<script>
export default {
  name: 'ColorPickButton',
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    },
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    model: {
      get () {
        return this.value === '' ? [] : [this.value]
      },
      set (val) {
        this.$emit('input', val[val.length - 1])
      }
    }
  }
}
</script>
