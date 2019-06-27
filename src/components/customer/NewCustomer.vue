<template>
  <q-card class="h-rounded-borders-20" flat>
    <q-form @submit="submit()" @reset="$emit('reset')">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">Nuevo cliente</div>
      </q-card-section>
      <q-card-section class="q-gutter-y-xs">
        <q-input
          autofocus
          input-class="text-black ellipsis"
          label="Nombre"
          standout="bg-blue-1"
          dense
          hide-bottom-space
          v-model="fullName"
          type="text"
          maxlength="40"
          :rules="[ val=> !!val || 'Campo requerido', val=> val.length <= 40 || 'Máximo 40 caracteres' ]"
        />
        <q-input
          input-class="text-black ellipsis"
          label="Teléfono"
          standout="bg-blue-1"
          dense
          hide-bottom-space
          v-model="phone"
          type="tel"
          mask="(##) #### ####"
          unmasked-value
          :rules="[ val=> !!val || 'Campo requerido', val => val.replace(/\s/g, '').length === 10 || 'Teléfono debe tener 10 dígitos']"
        />
        <q-input
          input-class="text-black ellipsis"
          label="Correo electrónico"
          standout="bg-blue-1"
          dense
          hide-bottom-space
          v-model="email"
          type="email"
          :rules="[ val=> val.length <= 256 || 'Máximo 256 caracteres' ]"
        />
      </q-card-section>
      <q-separator inset/>
      <q-card-actions align="around">
        <q-btn icon="clear" color="red" dense flat round type="reset">
          <q-tooltip>Cancelar</q-tooltip>
        </q-btn>
        <q-btn icon="done" color="teal" dense flat round type="submit">
          <q-tooltip>Guardar</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import CreateCustomer from 'src/graphql/mutations/CreateCustomer.gql'
import UserCustomers from 'src/graphql/queries/UserCustomers.gql'
import { Auth } from 'src/helpers'

export default {
  name: 'HNewCustomer',
  data () {
    return {
      id: '',
      data: {},
      model: {
        name1: '',
        lastName1: '',
        phone: '',
        email: ''
      },
      edges: {
        customerOf: {
          target: Auth.userId
        }
      }
    }
  },
  methods: {
    updateCache (cache, { data }) {
      const cached = cache.readQuery({
        query: UserCustomers,
        variables: {
          id: Auth.userId
        }
      })
      this.id = data.createBP.uid
      cached.user.customers.edges.push({
        __typename: 'UserToBpEdge',
        node: data.createBP
      })
      // Update customer list cache
      cache.writeQuery({
        query: UserCustomers,
        variables: {
          id: Auth.userId
        },
        data: cached
      })
    },
    submit () {
      this.$apollo.mutate({
        mutation: CreateCustomer,
        variables: { data: { ...this.data, edges: { ...this.edges } } },
        context: {
          headers: {
            'X-Csrf-Token': this.$q.cookies.get('csrf-token')
          }
        },
        update: this.updateCache
      }).then(res => this.onSuccess(res)).catch(err => this.onError(err))
    },
    onSuccess (response) {
      this.$q.notify({
        color: 'positive',
        message: 'Cambios guardados',
        icon: 'check_circle'
      })
      this.$emit('submit')
      this.$router.push({ name: 'customerDetails', params: { id: this.id } })
    },
    onError (error) {
      console.log(error)
      this.$q.notify({
        color: 'negative',
        message: 'No pudimos guardar los cambios :(',
        icon: 'report_problem'
      })
      if (error.graphQLErrors.length > 0) console.error(error.graphQLErrors)
      else console.log(error)
    }
  },
  computed: {
    fullName: {
      get () {
        if (this.model.lastName1 === '') return this.model.name1
        else return `${this.model.name1} ${this.model.lastName1}`
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

        // this avoid unnecessary saving by comparing current value to original one
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
  }
}
</script>

<style scoped lang="stylus"></style>
