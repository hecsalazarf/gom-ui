export const EditableOrder = {
  conditions: {
    any: [
      {
        all: [
          {
            fact: 'status',
            operator: 'in',
            value: ['CLOSED', 'WON']
          }
        ]
      },
      {
        // Check if user is customer and status is IN_PROCESS (Fix #40)
        all: [
          {
            fact: 'status',
            operator: 'in',
            value: ['IN_PROCESS']
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
