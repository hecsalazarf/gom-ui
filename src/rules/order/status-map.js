import { OrderStatus } from 'src/constants/order'

/*
* Status map works this way: e.g. when current status is IN_PROCESS,
* the user can select CLOSED and WON only
*/

const option1 = {
  conditions: {
    all: [{
      fact: 'currentStatus',
      operator: 'in',
      value: [OrderStatus.OPEN]
    }]
  },
  event: {
    type: 'nextStatus',
    params: {
      next: [ OrderStatus.WON, OrderStatus.CLOSED, OrderStatus.IN_PROCESS ]
    }
  }
}

const option2 = {
  conditions: {
    all: [{
      fact: 'currentStatus',
      operator: 'in',
      value: [ OrderStatus.CLOSED, OrderStatus.WON ]
    }]
  },
  event: {
    type: 'nextStatus',
    params: {
      next: [ ]
    }
  }
}

const option3 = {
  conditions: {
    all: [{
      fact: 'currentStatus',
      operator: 'in',
      value: [ OrderStatus.IN_PROCESS ]
    }]
  },
  event: {
    type: 'nextStatus',
    params: {
      next: [ OrderStatus.CLOSED, OrderStatus.WON ]
    }
  }
}

export const StatusMap = [
  option1,
  option2,
  option3
]
