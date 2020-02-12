import UpdatePromotion from 'src/graphql/mutations/UpdatePromotion.gql'

// Use this object as a mixin
export default {
  data () {
    return {
      editMode: false,
      model: { ...this.value },
      tempModel: {} // mutation variable
    }
  },
  watch: {
    value (newVal) {
      this.model = { ...this.value }
    }
  },
  methods: {
    clear () {
      this.model = { ...this.value } // revert changes
      this.tempModel = {} // reset temporary changes
      this.editMode = false // disable edit mode
    },
    updateModel () {
      if (Object.keys(this.tempModel).length === 0) {
        this.editMode = false
        return // Do not save if no changes
      }
      this.$q.loading.show()
      this.$apollo.mutate({
        mutation: UpdatePromotion,
        variables: {
          where: {
            uid: this.model.uid
          },
          data: this.tempModel
        }
        /* { id: this.order.id, data: this.data } */
      }).then(res => {
        this.clear() // reset submitted data
        this.$q.loading.hide()
        this.$q.notify({ color: 'positive', message: this.$t('notifications.positive.changes_saved'), icon: 'check_circle' })
      })
    }
  }
}
