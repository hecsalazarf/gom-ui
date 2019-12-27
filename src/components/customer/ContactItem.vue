<template>
  <div>
    <q-slide-item>
      <q-item
        v-ripple
        clickable
        @click="$router.push({name: $options.routes.customerDetails, params: { id: value.id }})"
      >
        <q-item-section avatar>
          <q-avatar
            color="customers"
            text-color="white"
          >
            {{ value.charName }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle1">
            {{ fullName }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-slide-item>
    <q-separator
      v-if="separator"
      inset
    />
  </div>
</template>

<script>
import { RouteNames } from 'src/constants/app'
export default {
  name: 'HContactItem',
  props: {
    separator: {
      type: Boolean,
      default: false
    },
    avatarChar: {
      type: String,
      default: 'AC'
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  computed: {
    fullName () {
      if (this.value.lastName1 === '' ||
          !this.value.lastName1) { // check it's not null. Fix (#15)
        return this.value.name1
      } else return `${this.value.name1} ${this.value.lastName1}`
    }
  },
  routes: {
    customerDetails: RouteNames.CUSTOMER_DETAILS
  }
}
</script>

<style scoped lang="stylus">
 /deep/ .q-slide-item
    background: transparent //overrides default white color

  /deep/ .q-slide-item__right
    border-top-right-radius: 20px //overrides no-border style
    border-top-left-radius: 20px
</style>
