<template>
  <q-page padding>
    <div class="row full-width justify-center content-start">
      <div class="col-xs-12 col-sm-12 col-md-8">
        <q-list class="q-gutter-y-sm">
          <h-promo-general-data
            ref="generalData"
            readonly
            force-edit
          />
          <h-promo-content-data
            ref="contentData"
            readonly
            force-edit
          />
          <q-btn
            outline
            class="full-width"
            rounded
            label="Guardar"
            color="accent"
            @click="submit"
          />
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import CreatePromotion from 'src/graphql/mutations/CreatePromotion.gql'
import { RouteNames } from 'src/constants/app'
import DataLayer from '../../components/promo/dataLayer'

const { mapActions } = createNamespacedHelpers('GomState')
const { PROMO_DETAILS } = RouteNames
export default {
  name: 'NewPromoPage',
  components: {
    'h-promo-general-data': () => import('components/promo/GeneralData.vue'),
    'h-promo-content-data': () => import('components/promo/ContentData.vue')
  },
  mixins: [DataLayer],
  data () {
    return {
      submitted: false
    }
  },
  beforeMount () {
    this.changeActiveToolbar('h-promo-toolbar')
  },
  beforeDestroy () {
    this.changeActiveToolbar(null)
  },
  methods: {
    ...mapActions(['changeActiveToolbar']),
    buildSubmitData () {
      const dataToSubmit = {}
      for (const ref in this.$refs) {
        Object.assign(dataToSubmit, this.$refs[ref].model.delta)
      }
      return dataToSubmit
    },
    validate (evt) {
      const validations = []
      for (const ref in this.$refs) {
        if ('validate' in this.$refs[ref]) {
          validations.push(this.$refs[ref].validate())
        }
      }
      return Promise.all(validations.map(p => p.catch(e => e))).then(res => res.every(res => res))
    },
    submit () {
      this.validate()
        .then((success) => {
          if (!success) {
            return undefined
          }
          this.$q.loading.show()
          const data = {
            ...this.buildSubmitData(),
            assignedTo: {
              connect: {
                extUid: this.$user.id
              }
            }
          }
          return this.$apollo.mutate({
            mutation: CreatePromotion,
            variables: { data },
            update: this.updateCache
          })
        })
        .then(res => {
          if (typeof res !== 'undefined') {
            this.submitted = true
            this.$router.replace({ name: PROMO_DETAILS, params: { id: res.data.createPromotion.uid } })
          }
        })
        .catch(e => console.log(e))
        .finally(() => this.$q.loading.hide())
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$can('create', 'promotion')) { // check permission
        vm.$router.back() // no permission, go back
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (Object.keys(this.buildSubmitData()).length > 0 && !this.submitted) {
      this.$q.dialog({
        title: this.$t('promo.confirm_exit_title'),
        message: this.$t('app.confirm_lose_data'),
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
      })
        .onOk(next)
        .onCancel(() => next(false))
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="stylus">
.q-expansion-item__content > .q-card
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
</style>
