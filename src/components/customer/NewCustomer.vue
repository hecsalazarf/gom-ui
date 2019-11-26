<template>
  <q-card
    class="h-rounded-borders-20"
    flat
  >
    <!-- Computed style is due to rendering issues on iOS -->
    <q-form
      :style="$q.platform.is.ios ? { 'max-height': '50vh' } : { }"
      class="scroll"
      @submit="submit()"
      @reset="$emit('reset')"
    >
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">
          {{ $t('customer.new') }}
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-y-xs">
        <q-input
          v-model="fullName"
          autofocus
          input-class="text-black ellipsis"
          :label="$t('customer.name')"
          standout="bg-secondary"
          dense
          hide-bottom-space
          type="text"
          maxlength="40"
          :rules="[ val=> !!val || $t('app.rules.required'), val=> val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
        />
        <q-input
          v-model="phone"
          input-class="text-black ellipsis"
          :label="$tc('customer.phone', 1)"
          standout="bg-secondary"
          dense
          hide-bottom-space
          type="tel"
          mask="(##) #### ####"
          unmasked-value
          :rules="[ val=> !!val || $t('app.rules.required'), val => val.replace(/\s/g, '').length === 10 || $t('customer.rules.phone_length', { count: 10 })]"
        />
        <q-input
          v-model="email"
          input-class="text-black ellipsis"
          :label="$t('customer.email')"
          standout="bg-secondary"
          dense
          hide-bottom-space
          type="email"
          :rules="[ val=> val.length <= 256 || $t('app.rules.max_length', { count: 256 }) ]"
        />
      </q-card-section>
      <q-separator inset />
      <q-card-actions align="around">
        <q-btn
          icon="clear"
          color="red"
          dense
          flat
          round
          type="reset"
          :aria-label="$t('app.abort')"
        >
          <q-tooltip>{{ $t('app.abort') }}</q-tooltip>
        </q-btn>
        <q-btn
          icon="done"
          color="teal"
          dense
          flat
          round
          type="submit"
          :aria-label="$t('app.save')"
        >
          <q-tooltip>{{ $t('app.save') }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { RouteNames } from 'src/constants/app'
import CreateCustomer from 'src/graphql/mutations/CreateCustomer.gql'
import UserCustomers from 'src/graphql/queries/UserCustomers.gql'
import { Analytics } from 'src/constants/customer'

export default {
  name: 'HNewCustomer',
  data () {
    return {
      data: {},
      model: {
        name1: '',
        lastName1: '',
        phone: '',
        email: ''
      }
    }
  },
  computed: {
    fullName: {
      get () {
        // Turn first letter to uppercase
        if (this.model.lastName1 === '' ||
            !this.model.lastName1) { // check it's not null. Fix (#15)
          return (
            this.model.name1.charAt(0).toUpperCase() + this.model.name1.slice(1)
          )
        } else {
          return `${this.model.name1.charAt(0).toUpperCase() +
            this.model.name1.slice(1)} ${this.model.lastName1.charAt(0).toUpperCase() +
            this.model.lastName1.slice(1)}`
        }
      },
      set (value) {
        // get splitted name and assign it to the corresponding variable
        const fullName = value
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
        if (fullName.length === 1) {
          this.model.name1 = fullName[0]
          this.model.lastName1 = ''
        } else {
          this.model.name1 = fullName.slice(0, fullName.length - 1).join(' ')
          this.model.lastName1 = fullName[fullName.length - 1]
        }

        // this avoids unnecessary saving by comparing current value to original one
        if (this.model.name1 !== '') {
          this.data.name1 = this.model.name1
        } else delete this.data.name1

        if (this.model.lastName1 !== '') {
          this.data.lastName1 = this.model.lastName1
        } else delete this.data.lastName1
      }
    },
    phone: {
      get () {
        return this.model.phone ? this.model.phone : ''
      },
      set (value) {
        this.model.phone = value
        if (value !== '') {
          this.data.phone = value
        } else delete this.data.phone
      }
    },
    email: {
      get () {
        return this.model.email ? this.model.email : ''
      },
      set (value) {
        this.model.email = value
        if (value !== '') {
          this.data.email = value
        } else delete this.data.email
      }
    }
  },
  methods: {
    queryCustomers () {
      this.$apollo.query({
        query: UserCustomers,
        variables: {
          where: {
            customerOf_some: {
              extUid: this.$user.id
            }
          },
          first: 20, // TODO Implement pagination
          skip: 0,
          orderBy: 'createdAt_DESC'
        },
        fetchPolicy: 'network-only' // Bypass cache in case query has been fetched before
      }).then(res => {
        // Nothing to do
      })
    },
    updateCache (cache, { data }) {
      try {
        const cached = cache.readQuery({
          query: UserCustomers,
          variables: {
            where: {
              customerOf_some: {
                extUid: this.$user.id
              }
            }
          }
        })
        if (!cached.bpsConnection.edges.length === 0) {
          /* If cache is empty but query has been executed,
          fetch customers to update cache
          for the first time (#18) */
          this.queryCustomers()
          return
        }
        cached.bpsConnection.edges.push({
          __typename: 'BpEdge',
          node: data.createBp
        })
        // Update customer list cache
        cache.writeQuery({
          query: UserCustomers,
          variables: {
            where: {
              customerOf_some: {
                extUid: this.$user.id
              }
            }
          },
          data: cached
        })
      } catch (err) {
        console.error(err)
      }
    },
    submit () {
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: CreateCustomer,
        variables: {
          data: {
            ...this.data,
            customerOf: {
              connect: {
                extUid: this.$user.id
              }
            }
          }
        },
        update: this.updateCache
      }).then(res => {
        this.$q.loading.hide()
        // Seng GA event
        this.$ga.event(Analytics.ACTION_CREATE, {
          event_category: Analytics.CATEGORY,
          event_label: this.$user.id
        })
        this.$router.push({ name: RouteNames.CUSTOMER_DETAILS, params: { id: res.data.createBp.uid } })
      })
    }
  }
}
</script>

<style scoped lang="stylus"></style>
