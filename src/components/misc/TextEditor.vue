<template>
  <q-editor
    v-model="text"
    :dense="$q.screen.lt.sm"
    min-height="7rem"
    max-height="7rem"
    toolbar-text-color="primary"
    toolbar-toggle-color="accent"
    :toolbar="[
      [
        {
          icon: $q.iconSet.editor.formatting,
          fixedLabel: true,
          fixedIcon: true,
          options: [
            'p',
            'code',
            'h6',
            'h5',
            'h4',
          ]
        },
        {
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: true,
          list: 'no-icons',
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
          ]
        }
      ],
      [
        {
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        }
      ],
      ['bold','italic','underline','strike'],
      ['undo','redo'],
      ['quote', 'unordered', 'ordered']
    ]"
  />
</template>

<script>
export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    text: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
