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
            <h-promo-details-tab v-model="promo" />
          </q-tab-panel>
          <q-tab-panel name="publishing">
            <h-promo-publishing-tab />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <!-- </q-pull-to-refresh> -->
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'HPromoDetailsPage',
  components: {
    'h-promo-details-tab': () => import('components/promo/DetailsTab.vue'),
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
      promo: {}
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
    next()
    // next(vm => {
    //   if (!vm.$can('read', 'order')) { // check permission
    //     vm.$router.back() // no permission, go back
    //   }
    // })
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
