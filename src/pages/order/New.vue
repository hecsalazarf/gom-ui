<template>
  <q-page padding>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      keep-alive
      flat
      done-color="teal"
      :contracted="$q.screen.lt.md"
    >
      <q-step
        :name="1"
        title="Artículos"
        :caption="caption"
        icon="shopping_basket"
        active-icon="shopping_basket"
        :done="step > 1"
        class="q-pb-sm"
      >
        <h-order-item
          class="q-mb-sm"
          v-for="(item) in order.items"
          :key="item.data.id"
          v-model="item.data"
        />
        <q-btn
          icon="add"
          label="Agregar artículo"
          color="accent"
          class="full-width"
          rounded
          dense
          outline
          no-caps
          @click="order.items.push(order.items[0])"
        />
      </q-step>

      <q-step
        :name="2"
        title="Cliente"
        :caption="caption"
        icon="more"
        active-icon="more"
        :done="step > 2"
      >
        <div class="bg-blue-1 q-pa-sm q-mt-xs h-rounded-borders-20">
          <div class="q-gutter-y-sm">
            <!-- Order description -->
            <q-input label="Descripción" standout dense input-class="text-black">
              <template v-slot:prepend>
                <q-icon name="notes"/>
              </template>
            </q-input>
            <!-- Customer search -->
            <h-customer-search/>
          </div>
        </div>
      </q-step>

      <q-step
        :name="3"
        title="Confirmación"
        :caption="caption"
        icon="rate_review"
        active-icon="rate_review"
      >
        <h-order-summary/>
      </q-step>
      <template v-if="$q.screen.lt.md" v-slot:message>
        <div
          class="text-subtitle2 bg-blue-1 text-primary q-mb-md q-pl-lg q-pr-lg h-rounded-borders-20"
        >{{caption}}</div>
      </template>
      <template v-slot:navigation>
        <q-stepper-navigation class="float-right q-mt-md q-gutter-x-md">
          <q-btn
            v-if="step > 1"
            @click="$refs.stepper.previous()"
            color="primary"
            icon="arrow_back"
            size="lg"
            dense
            round
            flat
          />
          <q-btn
            v-if="step < 3"
            @click="$refs.stepper.next()"
            color="primary"
            icon="arrow_forward"
            size="lg"
            dense
            round
            flat
          />
          <q-btn
            v-if="step === 3"
            @click="submit()"
            color="teal"
            icon="send"
            size="lg"
            dense
            round
            flat
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'NewOrderPage',
  components: {
    'h-order-item': () => import('components/order/Item.vue'),
    'h-customer-search': () => import('components/customer/SearchInput.vue'),
    'h-order-summary': () => import('components/order/SummaryCard.vue')
  },
  data () {
    return {
      step: 1,
      order: {
        items: [
          {
            data: {
              id: '23',
              code: 'code',
              description: 'descr',
              provider: 'provider',
              quantity: 5,
              price: { amount: 253.6, currency: 'MXN' }
            }
          }
        ]
      }
    }
  },
  created () {
    this.changeActiveToolbar('h-order-toolbar')
  },
  methods: {
    submit () {
      console.log('submit')
    },
    ...mapActions(['changeActiveToolbar'])
  },
  computed: {
    caption () {
      let caption
      switch (this.step) {
        case 1:
          caption = 'Agrega los artículos a tu pedido'
          break
        case 2:
          caption = 'Agrega una descripción y selecciona un cliente'
          break
        case 3:
          caption = 'Confirma y envía tu pedido'
          break
      }
      return caption
    }
  },
  beforeRouteLeave (to, from, next) {
    this.changeActiveToolbar(null)
    next()
  }
}
</script>

<style scoped lang="stylus">
/deep/ .q-stepper__tab {
  padding: 0px;
}

/deep/ .q-stepper--horizontal .q-stepper__step-inner {
  padding: 0px;
}

.q-stepper--horizontal > .q-stepper__nav {
  padding: 0px;
}
</style>
