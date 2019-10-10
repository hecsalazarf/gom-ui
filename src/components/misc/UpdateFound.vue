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
          :loading="updating"
          @click="update"
        >
          <template v-slot:loading>
            <q-spinner-bars />
          </template>
        </q-btn>
        <q-btn
          v-if="!updating"
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
    return {
      updating: false
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    update (event) {
      this.updating = true
      this.$emit('ok')
    }
  }
}
</script>
