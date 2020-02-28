<template>
  <div class="column q-gutter-y-sm">
    <q-expansion-item
      class="bg-secondary h-rounded-borders-20"
      default-opened
      switch-toggle-side
      header-class="text-subtitle1 text-weight-medium text-primary"
      icon="notifications"
      :label="$tc('promo.notification', 2)"
    >
      <div class="row q-pa-md relative-position justify-between">
        <div class="col-xs-5 col-sm-5 col-md-4">
          <q-option-group
            v-model="model.delay"
            :options="delayOptions"
            color="primary"
            :disable="loading"
          />
          <q-btn
            :loading="loading"
            :disable="loading"
            color="accent"
            icon="publish"
            class="full-width q-mt-md"
            outline
            rounded
            no-caps
            @click="publish"
          >
            {{ $t('promo.publish') }}
            <template v-slot:loading>
              <q-spinner-bars />
            </template>
          </q-btn>
        </div>

        <div class="col-xs-6 col-sm-5 col-md-4">
          <q-timeline
            color="primary"
            layout="dense"
            class="no-margin"
          >
            <q-virtual-scroll
              class="q-pl-xs timeline-scroll"
              :items="publications"
            >
              <template v-slot="{ item, index }">
                <h-publish-timeline
                  :key="index"
                  v-model="item.node"
                />
              </template>
            </q-virtual-scroll>
          </q-timeline>
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { Publication } from 'src/models'
import CreatePublication from 'src/graphql/mutations/CreatePublication.gql'
import PromoPublications from 'src/graphql/queries/PromoPublications.gql'

const { mapGetters } = createNamespacedHelpers('GomState')

export default {
  name: 'HPromoPublishingTab',
  components: {
    'h-publish-timeline': () => import('components/promo/PublishTimeline')
  },
  props: {
    promoName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      model: new Publication(),
      loading: false,
      publications: []
    }
  },
  computed: {
    ...mapGetters(['activePromo'])
  },
  created () {
    this.delayOptions = [
      {
        label: this.$t('time.now'),
        value: 0
      },
      {
        label: this.$t('time.one_hour_later'),
        value: 3600000
      },
      {
        label: this.$t('time.one_day_later'),
        value: 86400000
      }
    ]
  },
  methods: {
    publish () {
      this.$q.dialog({
        title: this.$t('publication.confirm_new_title', { promo: this.promoName }),
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
      }).onOk(this.submit.bind(this))
    },
    updateCache (cache, { data }) {
      try {
        const cached = cache.readQuery({
          query: PromoPublications,
          variables: {
            where: {
              promotion: {
                uid: this.activePromo
              }
            }
          }
        })

        cached.publicationsConnection.edges.unshift({
          __typename: 'PublicationEdge',
          node: data.createPublication
        })

        // Update cache
        cache.writeQuery({
          query: PromoPublications,
          variables: {
            where: {
              promotion: {
                uid: this.activePromo
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
      this.loading = true
      this.$apollo.mutate({
        mutation: CreatePublication,
        update: this.updateCache.bind(this),
        variables: {
          data: {
            ...this.model,
            promotion: {
              connect: {
                uid: this.activePromo
              }
            }
          }
        }
      })
        .then(res => {
          this.$q.notify({ color: 'positive', message: this.$t('notifications.positive.changes_saved'), icon: 'check_circle' })
        })
        .finally(() => { this.loading = false })
    }
  },
  apollo: {
    publications () {
      return {
        query: PromoPublications,
        update: ({ publicationsConnection }) => {
          if (!publicationsConnection && publicationsConnection.edges.length > 0) {
            // If no orders, return empty array
            return []
          }
          return publicationsConnection.edges
        },
        watchLoading (isLoading, countModifier) {
          isLoading ? this.$q.loading.show() : this.$q.loading.hide()
        },
        variables: {
          where: {
            promotion: {
              uid: this.activePromo
            }
          },
          orderBy: 'updatedAt_DESC',
          first: 20
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .q-timeline h6
  display: none

.timeline-scroll
  max-height: 180px
</style>
