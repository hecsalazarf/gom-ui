<template>
  <q-page padding>
    <!-- <q-pull-to-refresh
      class="full-width"
      @refresh="refresh"
    > -->
    <div class="row full-width justify-center content-start">
      <div class="col-xs-12 col-sm-12 col-md-8">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            name="details"
            :label="$t('promo.details')"
          />
          <q-tab
            name="publishing"
            :label="$t('promo.publishing')"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels
          v-model="tab"
          animated
          keep-alive
        >
          <q-tab-panel name="details">
            <q-list class="q-gutter-y-sm">
              <h-promo-general-data v-model="promotion" />
              <h-promo-content-data v-model="promotion" />
              <h-promo-log-data v-model="promotion" />
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="publishing">
            <h-promo-publishing-tab :promo-name="promotion.name" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <!-- </q-pull-to-refresh> -->
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import PromotionDetails from 'src/graphql/queries/PromotionDetails.gql'

const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'HPromoDetailsPage',
  components: {
    'h-promo-general-data': () => import('components/promo/GeneralData.vue'),
    'h-promo-content-data': () => import('components/promo/ContentData.vue'),
    'h-promo-log-data': () => import('components/promo/LogData.vue'),
    'h-promo-publishing-tab': () => import('components/promo/PublishingTab.vue')
  },
  props: {
    id: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      tab: 'details',
      promotion: {}
    }
  },
  beforeMount () {
    this.changeActivePromo(this.id)
    this.changeActiveToolbar('h-promo-toolbar')
  },
  beforeDestroy () {
    this.changeActiveToolbar(null)
    this.changeActivePromo(null)
  },
  methods: {
    refresh (done) {
      done()
    },
    ...mapActions([
      'changeActivePromo',
      'changeActiveToolbar'
    ])
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$can('read', 'promotion')) { // check permission
        vm.$router.back() // no permission, go back
      }
    })
  },
  apollo: {
    promotion () {
      return {
        query: PromotionDetails,
        update: ({ promotion }) => promotion || {},
        watchLoading (isLoading, countModifier) {
          isLoading ? this.$q.loading.show() : this.$q.loading.hide()
        },
        variables: {
          where: {
            uid: this.id
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-tab-panel {
  padding-top: 16px;
  padding-right: 0px;
  padding-bottom: 16px;
  padding-left: 0px;
}
</style>
