/*
* Status map works this way: e.g. when current status is IN_PROCESS,
* the user can select CLOSED and WON only
*/

const option1 = {
  conditions: {
    all: [{
      fact: 'currentStatus',
      operator: 'in',
      value: ['OPEN']
    }]
  },
  event: {
    type: 'nextStatus',
    params: {
      next: [ 'WON', 'CLOSED', 'IN_PROCESS' ]
    }
  }
}

const option2 = {
  conditions: {
    all: [{
      fact: 'currentStatus',
      operator: 'in',
      value: [ 'CLOSED', 'WON' ]
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
      value: [ 'IN_PROCESS' ]
    }]
  },
  event: {
    type: 'nextStatus',
    params: {
      next: [ 'CLOSED', 'WON' ]
    }
  }
}

export const StatusMap = [
  option1,
  option2,
  option3
]
