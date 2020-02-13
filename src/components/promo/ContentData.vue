<template>
  <q-expansion-item
    class="bg-secondary h-rounded-borders-20"
    icon="receipt"
    switch-toggle-side
    default-opened
    header-class="text-subtitle1 text-weight-medium text-primary"
  >
    <template v-slot:header>
      <q-item-section>{{ $t('promo.content') }}</q-item-section>
      <q-item-section side>
        <div
          v-if="!readonly"
          class="row row q-gutter-x-md"
        >
          <q-btn
            v-show="!editable"
            icon="edit"
            color="accent"
            size="0.75em"
            flat
            dense
            round
            :aria-label="$t('app.edit')"
            @click.stop="editMode = true"
          >
            <q-tooltip>{{ $t('app.edit') }}</q-tooltip>
          </q-btn>
          <q-btn
            v-if="editable"
            icon="clear"
            color="red"
            size="0.75em"
            flat
            dense
            round
            :aria-label="$t('app.abort')"
            @click.stop="clear()"
          >
            <q-tooltip>{{ $t('app.abort') }}</q-tooltip>
          </q-btn>
          <q-btn
            v-if="editable"
            icon="done"
            color="teal"
            size="0.75em"
            flat
            dense
            round
            :aria-label="$t('app.save')"
            @click.stop="update"
          >
            <q-tooltip>{{ $t('app.save') }}</q-tooltip>
          </q-btn>
        </div>
      </q-item-section>
    </template>
    <q-card class="bg-secondary">
      <q-card-section>
        <q-form ref="form">
          <q-field
            v-model="plainContent"
            dense
            borderless
            hide-bottom-space
            counter
            :rules="[
              val => !!val || $t('app.rules.required'),
              val => val.length <= 140 || $t('app.rules.max_length', { count: 140 })
            ]"
          >
            <q-editor
              ref="editor"
              v-model="content"
              :dense="$q.screen.lt.sm"
              min-height="9rem"
              max-height="9rem"
              toolbar-text-color="primary"
              toolbar-toggle-color="accent"
              class="full-width"
              :class="{ transparent: !editable }"
              :readonly="!editable"
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
          </q-field>
        </q-form>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import DataLayer from './dataLayer'

export default {
  name: 'PromoContentData',
  mixins: [DataLayer],
  props: {
    value: {
      type: Object,
      default: () => ({}),
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    forceEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    plainContent () {
      if (typeof document !== 'undefined') {
        const el = document.createElement('div')
        el.innerHTML = this.content.replace(/<[^>]*>/g, '')
        return el.textContent
      }
      return this.content.replace(/<[^>]*>/g, '')
    },
    content: {
      get () {
        if (typeof this.model.content === 'undefined') {
          return ''
        }
        return this.model.content
      },
      set (content) {
        if (content !== this.value.content) this.tempModel.content = content
        else delete this.tempModel.content
        this.model.content = content
      }
    }
  },
  methods: {
    update () {
      this.validate().then(out => !out || this.updateModel())
    },
    validate () {
      return this.$refs.form.validate(true)
    },
    getModel () {
      return this.model
    }
  }
}
</script>

<style scoped lang="stylus">
.q-expansion-item__content > .q-card
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
.editor--focus
  border-color: $primary
  background-color: $white
</style>
