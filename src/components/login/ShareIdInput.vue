<template>
  <div class="column items-center q-gutter-y-md">
    <div class="text-h6 text-center">
      {{ $t('app.enter_shareid') }}
    </div>
    <div class="text-body2 text-center">
      {{ $t('app.missing_shareid') }}
    </div>
    <q-form
      class="q-gutter-y-md q-gutter-x-xs full-width row justify-center items-center"
      @submit="submit()"
    >
      <q-input
        v-model="shareId"
        class="col"
        input-class="text-h6 text-center h-shareid-input"
        color="primary"
        bg-color="white"
        maxlength="10"
        type="text"
        rounded
        outlined
        stack-label
        items-aligned
        hide-bottom-space
        lazy-rules
        :rules="[val => !!val || $t('app.rules.required'), val => val.length === 10 || $t('app.rules.fixed_length', { count: 10 })]"
      />
      <div class="col-12">
        <q-btn
          rounded
          class="full-width"
          :label="'Continuar'"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { throttle } from 'quasar'
import { LoginMixin } from './common'

export default {
  name: 'HSharedIdInput',
  mixins: [LoginMixin],
  props: {
  },
  data () {
    return {
      shareId: ''
    }
  },
  methods: {
    submit: throttle(function () {
      let response
      this.requestInfo()
        .then(res => {
          response = res.data
          return this.saveShareId('add')
        })
        .then(res => {
          this.$emit('change', {
            component: 'h-customer-login',
            props: {
              value: response,
              shareId: this.shareId
            }
          })
        })
    }, 2000)
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .h-shareid-input
  letter-spacing: 0.6em
  text-indent: 0.6em // No additional space added to last letter by letter-spacing
</style>
