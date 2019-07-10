const rule = {
  conditions: {
    all: [
      {
        fact: 'status',
        operator: 'in',
        value: ['CLOSED', 'WON']
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

export default rule
