import UpdatePromotion from 'src/graphql/mutations/UpdatePromotion.gql'
import UserPromotions from 'src/graphql/queries/UserPromotions.gql'

// Use this object as a mixin
export default {
  data () {
    return {
      editMode: false,
      model: { ...this.value },
      tempModel: {} // mutation variable
    }
  },
  computed: {
    editable () {
      return this.editMode || this.forceEdit
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
        },
        update: this.updateCache
        /* { id: this.order.id, data: this.data } */
      }).then(res => {
        this.clear() // reset submitted data
        this.$q.loading.hide()
        this.$q.notify({ color: 'positive', message: this.$t('notifications.positive.changes_saved'), icon: 'check_circle' })
      })
    },
    updateCache (cache, { data }) {
      const now = new Date()
      // In order to use the cache for consecutive call, we change the
      // current date every hour. Every hour a new request will be made.
      now.setHours(now.getHours(), 0, 0, 0)
      try {
        const cached = cache.readQuery({
          query: UserPromotions,
          variables: {
            whereIddle: {
              assignedTo: {
                extUid: this.$user.id
              },
              end_lt: now
            },
            whereActive: {
              assignedTo: {
                extUid: this.$user.id
              },
              end_gte: now
            }
          }
        })
        if (!cached.active.edges.length === 0) {
          // If cache is empty, fetch to update cache for the first time (#18)
          this.queryOrders() // TODO
          return
        }

        cached.active.edges.unshift({
          __typename: 'PromotionEdge',
          node: data.createPromotion
        })

        // Update orders cache
        cache.writeQuery({
          query: UserPromotions,
          variables: {
            whereIddle: {
              assignedTo: {
                extUid: this.$user.id
              },
              end_lt: now
            },
            whereActive: {
              assignedTo: {
                extUid: this.$user.id
              },
              end_gte: now
            }
          },
          data: cached
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
}
