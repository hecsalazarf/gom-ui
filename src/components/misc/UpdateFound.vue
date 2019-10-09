<template>
  <q-dialog
    ref="dialog"
    class="full-width"
    position="bottom"
    seamless
  >
    <q-banner
      rounded
      class="bg-accent text-white full-width"
    >
      {{ $t('app.update_found') }}

      <template v-slot:action>
        <q-btn
          flat
          dense
          :label="$t('app.update')"
          @click="$emit('ok', true)"
        />
        <q-btn
          flat
          dense
          :label="$t('app.abort')"
          @click="$refs.dialog.hide()"
        />
      </template>
      <template v-slot:avatar>
        <q-icon name="system_update_alt" />
      </template>
    </q-banner>
  </q-dialog>
</template>

<script>
export default {
  name: 'HUpdateFound',
  data () {
    return {}
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    }
  }
}
</script>
