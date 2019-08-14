<template>
  <q-toolbar>
    <q-btn
      class="q-mr-sm"
      icon="arrow_back_ios"
      color="primary"
      flat
      dense
      @click="$router.replace({ name: 'customers' })"
    />
    <div class="column items-start justify-center content-start ellipsis">
      <div class="col-5 text-subtitle1 text-weight-medium text-primary">
        {{ fullName }}
      </div>
    </div>
    <q-space />
    <q-btn
      flat
      dense
      round
      color="primary"
      icon="more_vert"
    >
      <q-menu>
        <q-list>
          <q-item
            v-close-popup
            clickable
            @click="confirmDelete()"
          >
            <q-item-section>
              <q-item-label class="text-body2">
                {{ $t('app.delete') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script>
import CustomerDetails from 'src/graphql/queries/CustomerDetails.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'OrderToolbar',
  data () {
    return {
      header: {
        name1: '',
        lastName1: ''
      }
    }
  },
  computed: {
    fullName () {
      if (this.header.lastName1 === '' ||
        !this.header.lastName1) { // check it's not null. Fix (#15)
        return this.header.name1
      } else return `${this.header.name1} ${this.header.lastName1}`
    },
    ...mapGetters(['activeCustomer'])
  },
  created () {
    this.$apollo
      .watchQuery({
        query: CustomerDetails,
        variables: {
          where: {
            uid: this.activeCustomer
          }
        }
      })
      .subscribe(this.updateHeader)
  },
  methods: {
    updateHeader ({ data: { bp } }) {
      this.header = {
        name1: bp.name1,
        lastName1: bp.lastName1
      }
    },
    confirmDelete () {
      this.$q.dialog({
        title: this.$t('app.delete_confirm', { object: this.fullName }),
        message: this.$t('app.continue_question'),
        position: 'bottom',
        persistent: true,
        cancel: {
          label: this.$t('app.no'),
          color: 'primary',
          flat: true
        },
        ok: {
          label: this.$t('app.yes'),
          color: 'primary',
          flat: true
        },
        stackButtons: false,
        color: 'primary'
      }).onOk(() => {
        this.emitEvent({
          target: 'CustomerDetailsPage',
          method: 'delete'
        })
      })
    },
    ...mapActions(['emitEvent'])
  }
}
</script>

<style>
</style>
