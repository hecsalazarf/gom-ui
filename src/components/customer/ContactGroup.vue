<template>
  <div>
    <q-item dense>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-medium">{{name}}</q-item-label>
      </q-item-section>
    </q-item>
    <div class="h-rounded-borders-20 bg-blue-1">
      <h-contact-item :separator="false"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HContactItem',
  props: {
    name: {
      type: String,
      default: 'GroupName'
    }
  },
  components: {
    'h-contact-item': () => import('components/customer/ContactItem.vue')
  },
  data () {
    return {
      sep: false
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
