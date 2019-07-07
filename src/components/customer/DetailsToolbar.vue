<template>
  <q-toolbar>
    <q-btn
      class="q-mr-sm"
      icon="arrow_back_ios"
      color="primary"
      flat
      dense
      @click="$router.back()"
    />
    <div class="column items-start justify-center content-start ellipsis">
      <div class="col-5 text-subtitle1 text-weight-medium text-primary">
        {{ fullName }}
      </div>
    </div>
    <q-space />
    <!-- <q-btn
      flat
      dense
      icon="more_horiz"
    >
      <q-menu>
        <q-list>
          <q-item
            v-close-popup
            clickable
          >
            <q-item-section>
              <q-item-label class="text-body2">
                Opcion 1
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn> -->
  </q-toolbar>
</template>

<script>
import CustomerDetails from 'src/graphql/queries/CustomerDetails.gql'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('GomState')

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
          id: this.activeCustomer
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
    }
  }
}
</script>

<style>
</style>
