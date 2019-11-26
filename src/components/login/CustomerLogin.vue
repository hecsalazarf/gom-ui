<template>
  <div class="column items-center q-gutter-y-md">
    <div class="text-body2 text-center">
      {{ $t('app.customer_welcome') }}
    </div>
    <div class="text-h6 text-center">
      {{ customerOf }}
    </div>
    <div class="text-body2 text-center">
      {{ $t('app.complete_phone') }}
    </div>
    <q-form
      class="q-gutter-y-md q-gutter-x-xs full-width row justify-center items-center"
      @submit="submit()"
    >
      <q-input
        v-model="digits"
        class="col"
        input-class="text-h6 text-center h-phone-password"
        color="primary"
        bg-color="white"
        maxlength="7"
        type="password"
        :disable="loading"
        rounded
        outlined
        stack-label
        items-aligned
        hide-bottom-space
        lazy-rules
        :rules="[val => !!val || $t('app.rules.required'), val => val.length === 7 || $t('app.rules.fixed_length', { count: 7 })]"
      />
      <div class="text-body1 col-1 text-right">
        {{ phoneLast }}
      </div>
      <div class="col-12">
        <q-btn
          rounded
          class="full-width"
          :label="$t('app.sign_in')"
          type="submit"
          color="primary"
          :loading="loading"
          :disable="loading"
        >
          <template v-slot:loading>
            <q-spinner-bars />
          </template>
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { throttle } from 'quasar'
import { LoginMixin } from './common'

export default {
  name: 'HCustomerLogin',
  mixins: [LoginMixin],
  props: {
    shareId: {
      type: String,
      required: false,
      default: ''
    },
    saveMode: {
      type: String,
      required: false,
      default: 'none'
    },
    value: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data () {
    return {
      loading: false,
      digits: '',
      customerOf: '',
      phoneLast: ''
    }
  },
  mounted () {
    if (Object.keys(this.value).length > 0) {
      this.customerOf = this.value.customerOf
      this.phoneLast = this.value.phoneLast
    } else {
      this.requestInfo().then(res => {
        this.customerOf = res.data.customerOf
        this.phoneLast = res.data.phoneLast
        this.saveShareId(this.saveMode)
      }).catch(e => {
        if (this.shareId !== '') {
          // emit change an render user-password login
          this.$emit('change', { component: 'h-simple-login' })
        }
      })
    }
  },
  methods: {
    setDigit (index, value) {
      this.digits.splice(index, 1, value)
      if (index < 6 - 1) {
        this.$refs[`digit${index + 1}`][0].focus() // automatically focus next field
      }
    },
    submit: throttle(function () { // Throttle login #50
      this.login({
        grantType: 'phone',
        username: this.shareId,
        phone: this.digits.concat(this.phoneLast) // concat phone number
      })
    }, 2000)
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .h-phone-password
  letter-spacing: 1em
  text-indent: 1em // No additional space added to last letter by letter-spacing
</style>
