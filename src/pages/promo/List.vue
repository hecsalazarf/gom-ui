<template>
  <q-page
    padding
    class="flex"
  >
    <div class="column full-width">
      <div
        v-if="promotions.active.edges.length"
        class="bg-secondary q-pa-sm active-promos"
      >
        <q-item dense>
          <q-item-section>
            <div class="text-subtitle1 text-weight-medium">
              {{ $tc('promo.active', 2) }}
            </div>
          </q-item-section>
        </q-item>
        <div class="row justify-center active-promos__scroll">
          <q-virtual-scroll
            :items="promotions.active.edges"
            virtual-scroll-horizontal
          >
            <template v-slot="{ item }">
              <h-active-promo v-model="item.node" />
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
            {{ $tc('promo.iddle', 2) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-list class="bg-secondary h-rounded-borders-20">
        <h-iddle-promo
          v-for="(iddle, index) in promotions.iddle.edges"
          ref="item"
          :key="iddle.node.uid"
          v-model="iddle.node"
          :separator="index < promotions.iddle.edges.length - 1"
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
        :to="{ name: $options.routes.newPromo }"
        :aria-label="$t('order.new')"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { RouteNames } from 'src/constants/app'
import UserPromotions from 'src/graphql/queries/UserPromotions.gql'

export default {
  name: 'HPromoListPage',
  components: {
    'h-iddle-promo': () => import('components/promo/IddleItem.vue'),
    'h-active-promo': () => import('components/promo/ActiveItem.vue')
  },
  data () {
    return {
      promotionsPerBlock: 15,
      promotions: {
        active: {
          edges: []
        },
        iddle: {
          edges: []
        }
      }
    }
  },
  apollo: {
    promotions () {
      const now = new Date()
      // In order to use the cache for consecutive call, we change the
      // current date every hour. Every hour a new request will be made.
      now.setHours(now.getHours(), 0, 0, 0)
      return {
        query: UserPromotions,
        update (data) {
          if (!data.active && !data.iddle) {
            // If no orders, return empty object
            return this.promotions
          }
          return data
        },
        watchLoading (isLoading, countModifier) {
          // Loading window is not shown when refetch is executed
          if (isLoading && !this.refetchFlag && !this.fetchMoreFlag) this.$q.loading.show()
          else this.$q.loading.hide()
        },
        variables: {
          whereIddle: {
            assignedTo: {
              extUid: this.$user.id
            },
            end_lt: now
          },
          whereActive: {
            assignedTo: {
              extUid: this.$user.id
            },
            end_gte: now
          },
          first: this.promotionsPerBlock,
          skip: 0,
          orderBy: 'end_DESC'
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
    // next(vm => {
    //   if (!vm.$can('read', 'bps')) { // check permission
    //     vm.$router.back() // no permission, go back
    //   }
    // })
  },
  routes: {
    newPromo: RouteNames.PROMO_NEW
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
