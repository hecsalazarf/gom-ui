import { OrderStatus } from 'src/constants/order'

export const RestrictStatus = {
  conditions: {
    any: [{
      all: [
        {
          fact: 'statusToRestrict',
          operator: 'in',
          value: [ OrderStatus.WON, OrderStatus.IN_PROCESS ]
        },
        {
          fact: 'isCustomer',
          operator: 'equal',
          value: true
        }
      ]
    }]
  },
  event: {
    type: 'statusRestricted'
  }
}
