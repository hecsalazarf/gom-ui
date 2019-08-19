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
      <div class="text-body1 col-1 text-left">
        {{ phoneFirst }}
      </div>
      <q-input
        v-model="digits"
        class="col"
        input-class="text-h6 text-center h-phone-password"
        color="primary"
        bg-color="white"
        maxlength="5"
        type="tel"
        rounded
        outlined
        stack-label
        items-aligned
        hide-bottom-space
        lazy-rules
        :rules="[val => !!val || $t('app.rules.required'), val => val.length === 5 || $t('app.rules.fixed_length', { count: 5 })]"
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
import { Notifications } from 'src/helpers'
const { notifyError } = Notifications

export default {
  name: 'HCustomerLogin',
  mixins: [ LoginMixin ],
  props: {
    reference: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      digits: '',
      customerOf: '',
      phoneFirst: '',
      phoneLast: ''
    }
  },
  created () {
    this.requestInfo()
  },
  methods: {
    requestInfo () {
      this.$q.loading.show()
      this.$axios.get('auth/bp', {
        params: {
          code: this.reference
        }
      }).then(res => {
        this.customerOf = res.data.customerOf
        this.phoneLast = res.data.phoneLast
        this.phoneFirst = res.data.phoneFirst
      }).catch(error => {
        if (error.response && error.response.status === 400) {
          this.$q.notify({ // notify invalid reference
            color: 'negative',
            message: this.$t('app.invalid_reference'),
            icon: 'report_problem'
          })
        } else {
          notifyError.call(this) // any other error notify with generic error
        }
        this.$emit('error') // emit error an render user-password login
        console.log(error)
      }).finally(() => this.$q.loading.hide())
    },
    setDigit (index, value) {
      this.digits.splice(index, 1, value)
      if (index < 6 - 1) {
        this.$refs[`digit${index + 1}`][0].focus() // automatically focus next field
      }
    },
    submit: throttle(function () { // Throttle login #50
      this.login({
        grantType: 'phone',
        username: this.reference,
        phone: this.phoneFirst.concat(this.digits, this.phoneLast) // concat phone number
      })
    }, 2000)
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .h-phone-password
  letter-spacing: 1em
  text-indent: 1em // No additional space added to last letter by letter-spacing
  -webkit-text-security: disc // Make non-password inputs use bullets
</style>
