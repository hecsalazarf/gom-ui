<template>
  <div class="column items-center q-gutter-y-md">
    <!-- <div class="text-h5 text-center">
      Hola
    </div> -->
    <div class="text-body2 text-center">
      Estás intentando acceder al centro de pedidos de
    </div>
    <div class="text-h6 text-center">
      {{ customerOf }}
    </div>
    <q-form
      class="q-gutter-y-md q-gutter-x-xs full-width row justify-center"
      @submit="submit()"
    >
      <q-input
        v-for="(digit, index) in digits"
        :ref="`digit${index}`"
        :key="index"
        :value="digits[index]"
        class="col"
        type="password"
        input-class="text-center text-h6"
        bg-color="white"
        maxlength="1"
        dense
        @input="setDigit(index, $event)"
      />
      <div class="text-body1 col-1 self-center text-right">
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
import { LoginMixin } from './common'

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
      digits: new Array(6), // digits to complete
      customerOf: '',
      phoneLast: '',
      loading: false
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
        this.$q.loading.hide()
      }).catch(err => {
        this.$q.loading.hide()
        console.log(err)
      })
    },
    setDigit (index, value) {
      this.digits.splice(index, 1, value)
      if (index < 6 - 1) {
        this.$refs[`digit${index + 1}`][0].focus() // automatically focus next field
      }
    },
    submit () {
      this.login({
        grantType: 'phone',
        username: this.reference,
        phone: this.digits.join('') + this.phoneLast
      })
    }
  }
}
</script>

<style>
</style>
