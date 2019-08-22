export const OrderMixin = {
  methods: {
    /**
     * Build query vars depending on the user role
     */
    buildQueryVars () {
      if (this.$can('role', 'customer')) {
        return {
          issuedTo: {
            uid: this.$user.id
          }
        }
      }

      if (this.$can('role', 'seller')) {
        return {
          assignedTo: {
            extUid: this.$user.id
          }
        }
      }
    },

    /**
     * Build mutation vars depending on the user role
     */
    buildMutationVars () {
      let assignedTo, issuedTo
      if (this.$can('role', 'customer')) {
        assignedTo = this.$user.seller // it is assigned to customer's provider
        issuedTo = this.$user.id // the customer cannot choose customer, it is issued to itself
      } else if (this.$can('role', 'seller')) {
        assignedTo = this.$user.id // it is assigned to itself
        issuedTo = this.order.customer.value // the seller chooses the customer
      }

      return {
        assignedTo: {
          connect: {
            extUid: assignedTo
          }
        },
        issuedTo: {
          connect: {
            uid: issuedTo
          }
        }
      }
    }
  }
}
