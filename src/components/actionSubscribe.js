// Use this object as a mixin
export const ActionSubscribe = {
  data () {
    return {
      unsubscribeAction: null
    }
  },
  destroyed () {
    this.unsubscribeAction() // ALWAYS unsubscribe from vuex store actions
  },
  created () {
    /**
     * Subscribe a component to listen to events triggered from an external
     * component. The actions dispatched are only those that the subscriber
     * owns. This is a better alternative than using the global event bus through
     * vue.$root
     */
    this.unsubscribeAction = this.$store.subscribeAction({
      after: (action, state) => { // execute after vuex dispatching
        if (action.type === 'GomState/emitEvent' && // check the action is of type emitEvent
        action.payload.target === this.$options.name && // check the action is intended for this component
        this[action.payload.method] // check the method exists in the component
        ) {
          this[action.payload.method](action.payload.args) // execute action
        }
      }
    })
  }
}
