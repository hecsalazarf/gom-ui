<template>
  <q-expansion-item
    class="bg-secondary h-rounded-borders-20"
    icon="history"
    switch-toggle-side
    :label="$t('promo.log')"
    default-opened
    header-class="text-subtitle1 text-weight-medium text-primary"
  >
    <q-card class="bg-secondary">
      <q-card-section>
        <q-input
          v-model="model.createdAt"
          dense
          :label="$t('promo.createdAt')"
          readonly
          borderless
        />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="model.updatedAt"
          dense
          :label="$t('promo.updatedAt')"
          readonly
          borderless
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import DataLayer from './dataLayer'

export default {
  name: 'PromoLogData',
  mixins: [DataLayer],
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    }
  }
}
</script>
