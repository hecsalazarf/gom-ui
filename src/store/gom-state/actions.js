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

export function changeMoreOrders (context, moreOrders) {
  context.commit('setMoreOrders', moreOrders)
}

/**
 * Clear all store
 * @param {any} context Context
 */
export function clearAll (context) {
  context.commit('resetState')
}
