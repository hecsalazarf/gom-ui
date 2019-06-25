<template>
  <q-page padding class="flex">
    <q-list class="full-width">
      <h-contact-group
        v-for="group in groups"
        :key="group.id"
        v-model="group.contacts"
        :name="group.name"
      />
    </q-list>
    <q-dialog
      ref="newCustomer"
      persistent
      :position="$q.platform.is.mobile ? 'bottom' : 'standard'"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <h-new-customer @reset="$refs.newCustomer.hide()" class="new-customer-dialog"/>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        round
        color="accent"
        icon="person_add"
        class="shadow-7"
        @click="$refs.newCustomer.show()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  props: {},
  components: {
    'h-contact-group': () => import('components/customer/ContactGroup.vue'),
    'h-new-customer': () => import('components/customer/NewCustomer.vue')
  },
  name: 'CustomerListPage',
  methods: {
    cancelD () {
      console.log('cancel')
    }
  },
  data () {
    return {
      groups: [
        // dummy data, for component showcase. NOT FOR PRODUCTION
        {
          name: 'A',
          id: 'A',
          contacts: [
            {
              data: {
                id: '1',
                name: 'Adriana Sanchez',
                charName: 'AS'
              }
            },
            {
              data: {
                id: '2',
                name: 'Ariel Zapata',
                charName: 'AZ'
              }
            }
          ]
        },
        {
          name: 'B',
          id: 'B',
          contacts: [
            {
              data: {
                id: '3',
                name: 'Bartolo Lara',
                charName: 'BL'
              }
            },
            {
              data: {
                id: '4',
                name: 'Beatriz Manzano',
                charName: 'BM'
              }
            },
            {
              data: {
                id: '5',
                name: 'Bernardo Aros',
                charName: 'BA'
              }
            }
          ]
        },
        {
          name: 'C',
          id: 'C',
          contacts: [
            {
              data: {
                id: '6',
                name: 'Carlos Buenavista',
                charName: 'CB'
              }
            }
          ]
        }
      ]
    }
  },
  mounted () {}
}
</script>

<style scoped lang="stylus">
.new-customer-dialog
  width: 50vw
</style>
