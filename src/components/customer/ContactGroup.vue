<template>
  <div>
    <q-item dense>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-medium">
          {{ name }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <div class="h-rounded-borders-20 bg-blue-1">
      <h-contact-item
        v-for="(contact, index) in value"
        :key="contact.data.id"
        v-model="contact.data"
        :separator="index < value.length - 1"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HContactItem',
  components: {
    'h-contact-item': () => import('components/customer/ContactItem.vue')
  },
  props: {
    name: {
      type: String,
      default: 'GroupName'
    },
    value: {
      type: Array,
      default: () => [],
      required: true
    }
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
