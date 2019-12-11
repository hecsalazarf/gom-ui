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
            v-model="delay"
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
            @click="simulateProgress(3)"
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
              :items="notifications"
            >
              <template v-slot="{ item, index }">
                <h-publish-timeline
                  :key="index"
                  v-model="item.data"
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
export default {
  name: 'HPromoPublishingTab',
  components: {
    'h-publish-timeline': () => import('components/promo/PublishTimeline')
  },
  data () {
    return {
      delay: '1h',
      loading: false,
      notifications: [
        {
          data: {
            status: 'waiting',
            createdAt: '09/12/2019 19:39',
            delay: 120000
          }
        },
        {
          data: {
            status: 'done',
            createdAt: '08/12/2019 12:17:18',
            finished: '08/12/2019 12:19:46'
          }
        },
        {
          data: {
            status: 'error',
            createdAt: '08/12/2019 21:54',
            message: 'Error al enviar las notificaciones'
          }
        },
        {
          data: {
            status: 'waiting',
            createdAt: '09/12/2019 19:39',
            delay: 432000000
          }
        }
      ],
      delayOptions: [
        {
          label: this.$t('time.now'),
          value: 'now'
        },
        {
          label: this.$t('time.one_hour_later'),
          value: '1h_later'
        },
        {
          label: this.$t('time.one_day_later'),
          value: '1d_later'
        }
      ]
    }
  },
  methods: {
    simulateProgress () {
      this.loading = true
      setTimeout(() => { this.loading = !this.loading }, 3000)
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
