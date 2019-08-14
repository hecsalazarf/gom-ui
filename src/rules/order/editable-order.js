import { OrderStatus } from 'src/constants/order'

export const EditableOrder = {
  conditions: {
    any: [
      {
        all: [
          {
            fact: 'status',
            operator: 'in',
            value: [ OrderStatus.CLOSED, OrderStatus.WON ]
          }
        ]
      },
      {
        // Check if user is customer and status is IN_PROCESS (Fix #40)
        all: [
          {
            fact: 'status',
            operator: 'in',
            value: [ OrderStatus.IN_PROCESS ]
          },
          {
            fact: 'isCustomer',
            operator: 'equal',
            value: true
          }
        ]
      }
    ]
  },
  event: {
    type: 'readonly-order',
    params: {
      message: 'Order is readonly'
    }
  }
}
