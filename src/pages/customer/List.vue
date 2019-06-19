<template>
  <q-page class="flex">
    <q-list bordered class="full-width">
      <h-contact-group v-for="group in groups" :key="group.group.id" v-model="group.group.contacts" :name="group.group.name"/>
    </q-list>
  </q-page>
</template>

<script>
export default {
  props: {},
  components: {
    'h-contact-group': () => import('components/customer/ContactGroup.vue')
  },
  name: 'CustomerListPage',
  data () {
    return {
      groups: [
        // dummy data, for component showcase. NOT FOR PRODUCTION
        {
          group: {
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
          }
        },
        {
          group: {
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
          }
        },
        {
          group: {
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
        }
      ]
    }
  },
  mounted () {}
}
</script>

<style scoped lang="stylus"></style>
