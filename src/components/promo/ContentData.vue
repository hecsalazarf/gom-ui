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
            v-show="!editMode"
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
            v-if="editMode"
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
            v-if="editMode"
            icon="done"
            color="teal"
            size="0.75em"
            flat
            dense
            round
            :aria-label="$t('app.save')"
            @click.stop="$refs.form.validate(true).then(out => { if(out) save() })"
          >
            <q-tooltip>{{ $t('app.save') }}</q-tooltip>
          </q-btn>
        </div>
      </q-item-section>
    </template>
    <q-card class="bg-secondary">
      <q-card-section>
        <!-- <h-text-editor v-model="content" /> -->
        <q-editor
          v-model="content"
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
    }
  },
  data () {
    return {
    }
  },
  computed: {
    content: {
      get () {
        if (typeof this.model.content === 'undefined') {
          return ''
        }
        return this.model.content
      },
      set (content) {
        if (content !== this.model.content) this.tempModel.content = content
        else delete this.tempModel.content
        this.model.content = content
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.q-expansion-item__content > .q-card
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
</style>
