export function changeActiveOrder (context, orderId) {
  context.commit('setActiveOrder', orderId)
}

export function changeActiveToolbar (context, toolbar) {
  context.commit('setActiveToolbar', toolbar)
}

export function changeActiveOrderTab (context, orderTab) {
  context.commit('setActiveOrderTab', orderTab)
}

export function emitEvent (context, event) {
  context.commit('setEvent', event)
}

export function changeSelectedOrders (context, orders) {
  context.commit('setSelectedOrders', orders)
}

export function changeActiveCustomer (context, customer) {
  context.commit('setActiveCustomer', customer)
}
