<template>
  <q-page
    padding
    class="flex"
  >
    <div class="column full-width">
      <div
        class="bg-secondary q-pa-sm active-promos"
      >
        <q-item dense>
          <q-item-section>
            <div class="text-subtitle1 text-weight-medium">
              {{ "Vigentes" }}
            </div>
          </q-item-section>
        </q-item>
        <div class="row justify-center active-promos__scroll">
          <q-virtual-scroll
            :items="promos1"
            virtual-scroll-horizontal
          >
            <template v-slot="{ item }">
              <h-active-promo v-model="item.data" />
            </template>
          </q-virtual-scroll>
        </div>
      </div>
      <q-item
        dense
        class="q-mt-sm"
      >
        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-medium">
            {{ "Anteriores" }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-list class="bg-secondary h-rounded-borders-20">
        <h-iddle-promo
          v-for="(promo, index) in promos2"
          ref="item"
          :key="promo.data.id"
          v-model="promo.data"
          :separator="index < promos2.length - 1"
        />
      </q-list>
    </div>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        round
        color="accent"
        icon="note_add"
        class="shadow-7"
        :to="{ name: 'newOrder' }"
        :aria-label="$t('order.new')"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'HPromoListPage',
  components: {
    'h-iddle-promo': () => import('components/promo/IddleItem.vue'),
    'h-active-promo': () => import('components/promo/ActiveItem.vue')
  },
  data () {
    return {
      promos1: [
        {
          data: {
            id: '1',
            name: 'Promo 1',
            code: 'Código 1',
            color: 'green'
          }
        },
        {
          data: {
            id: '4',
            name: 'Promo 4',
            code: 'Código 4',
            color: 'yellow'
          }
        },
        {
          data: {
            id: '5',
            name: 'Promo 5',
            code: 'Código 5',
            color: 'red'
          }
        },
        {
          data: {
            id: '6',
            name: 'Promo 6',
            code: 'Código 6',
            color: 'blue'
          }
        }
      ],
      promos2: [
        {
          data: {
            id: '2',
            name: 'Promo 2',
            code: 'Código 2'
          }
        },
        {
          data: {
            id: '3',
            name: 'Promo 3',
            code: 'Código 3'
          }
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
    // next(vm => {
    //   if (!vm.$can('read', 'bps')) { // check permission
    //     vm.$router.back() // no permission, go back
    //   }
    // })
  }
}
</script>

<style scoped lang="stylus">
@media (max-width: $breakpoint-xs-max)
  .active-promos
    margin: -8px
    margin-bottom: 0

@media (max-width: $breakpoint-md-max) and (min-width: $breakpoint-sm-min)
  .active-promos
    margin: -16px
    margin-bottom: 0

@media (min-width: $breakpoint-lg-min)
  .active-promos
    margin: -24px
    margin-bottom: 0

.active-promos .active-promos__scroll
  width: 95vw
  height: 180px
</style>
