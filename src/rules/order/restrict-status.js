export const RestrictStatus = {
  conditions: {
    any: [{
      all: [
        {
          fact: 'statusToRestrict',
          operator: 'in',
          value: [ 'WON', 'IN_PROCESS' ]
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
