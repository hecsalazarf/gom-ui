<template>
  <q-page padding>
    <div class="row full-width justify-center content-start">
      <div class="col-xs-12 col-sm-12 col-md-8">
        <q-list class="q-gutter-y-sm">
          <q-expansion-item
            class="bg-secondary h-rounded-borders-20"
            default-opened
            switch-toggle-side
            header-class="text-subtitle1 text-weight-medium text-primary"
          >
            <template v-slot:header>
              <q-item-section>{{ $t('promo.review') }}</q-item-section>
            </template>
            <q-card class="bg-secondary">
              <q-form ref="form">
                <q-card-section class="q-col-gutter-xs">
                  <div class="row justify-between items-end">
                    <q-input
                      v-model="promo.code"
                      class="col-12"
                      dense
                      standout="bg-secondary"
                      input-class="text-black"
                      :label="$t('promo.code')"
                      type="text"
                      maxlength="40"
                      :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
                      hide-bottom-space
                    />
                  </div>
                  <q-input
                    v-model="promo.name"
                    dense
                    standout="bg-secondary"
                    input-class="text-black"
                    :label="$t('promo.name')"
                    type="text"
                    maxlength="40"
                    :rules="[ val => !!val || $t('app.rules.required'), val => val.length <= 40 || $t('app.rules.max_length', { count: 40 }) ]"
                    hide-bottom-space
                  />
                  <div class="row q-col-gutter-xs">
                    <h-datetime
                      v-model="promo.start"
                      dense
                      class="col-xs-12"
                      standout="bg-secondary"
                      input-class="text-black"
                      :label="$t('promo.start')"
                      hide-bottom-space
                      mask="DD-MMM-YYYY hh:mm A"
                      raw
                      :rules="[ val => !!val || $t('app.rules.required') ]"
                    />
                    <h-datetime
                      v-model="promo.end"
                      dense
                      class="col-xs-12"
                      standout="bg-secondary"
                      input-class="text-black"
                      :label="$t('promo.end')"
                      hide-bottom-space
                      mask="DD-MMM-YYYY hh:mm A"
                      raw
                      :rules="[ val => !!val || $t('app.rules.required') ]"
                    />
                  </div>
                  <q-field
                    v-model="promo.category"
                    dense
                    class="col-xs-4 col-sm-3 col-md-2"
                    standout="bg-secondary"
                    input-class="text-black"
                    :label="$t('promo.category')"
                    stack-label
                    hide-bottom-space
                    :rules="[ val => !!val || $t('app.rules.required') ]"
                  >
                    <template v-slot:control>
                      <h-color
                        v-model="promo.category"
                        :options="$options.colors"
                      />
                    </template>
                  </q-field>
                </q-card-section>
              </q-form>
            </q-card>
          </q-expansion-item>

          <h-promo-content-data v-model="promo" />
          <q-btn
            outline
            class="full-width"
            rounded
            label="Guardar"
            color="accent"
            @click="validate"
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

const { mapActions } = createNamespacedHelpers('GomState')
const { PROMO_DETAILS } = RouteNames
export default {
  name: 'NewPromoPage',
  components: {
    'h-color': () => import('components/promo/ColorPickButton.vue'),
    'h-datetime': () => import('components/misc/DateTimePicker.vue'),
    'h-promo-content-data': () => import('components/promo/ContentData.vue')
  },
  data () {
    return {
      promo: {
        name: '',
        category: '',
        code: '',
        start: '',
        end: '',
        content: ''
      }
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
    validate (evt) {
      this.$refs.form.validate()
        .then(result => result ? this.submit() : '')
    },
    submit () {
      const data = {
        code: this.promo.code,
        name: this.promo.name,
        assignedTo: {
          connect: {
            extUid: this.$user.id
          }
        },
        category: this.promo.category,
        content: this.promo.content,
        start: this.promo.start.toISOString(),
        end: this.promo.end.toISOString()
      }
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: CreatePromotion,
        variables: { data }
      }).then(res => {
        this.$q.loading.hide()
        this.$router.replace({ name: PROMO_DETAILS, params: { id: res.data.createPromotion.uid } })
      }).catch(e => console.log(e))
    }
  },
  colors: [
    {
      val: 'pink',
      name: 'pink'
    },
    {
      val: 'purple',
      name: 'purple'
    },
    {
      val: 'indigo',
      name: 'indigo'
    },
    {
      val: 'teal',
      name: 'teal'
    },
    {
      val: 'red',
      name: 'red'
    },
    {
      val: 'brown',
      name: 'brown'
    },
    {
      val: 'grey',
      name: 'grey'
    },
    {
      val: 'dark',
      name: 'dark'
    }
  ]
}
</script>

<style scoped lang="stylus">
.q-expansion-item__content > .q-card
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
</style>
