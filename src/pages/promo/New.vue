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
  beforeMount () {
    this.changeActiveToolbar('h-promo-toolbar')
  },
  beforeDestroy () {
    this.changeActiveToolbar(null)
  },
  methods: {
    ...mapActions(['changeActiveToolbar']),
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
          const dataToSave = {}
          for (const ref in this.$refs) {
            Object.assign(dataToSave, this.$refs[ref].model.delta)
          }
          const data = {
            ...dataToSave,
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
            this.$router.replace({ name: PROMO_DETAILS, params: { id: res.data.createPromotion.uid } })
          }
        })
        .catch(e => console.log(e))
        .finally(() => this.$q.loading.hide())
    }
  }
}
</script>

<style scoped lang="stylus">
.q-expansion-item__content > .q-card
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
</style>
