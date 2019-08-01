import { getInitialState } from './state'

export function setActiveOrder (state, orderId) {
  state.activeOrder = orderId
}

export function setActiveToolbar (state, toolbar) {
  if (toolbar) {
    state.activeToolbar = toolbar
  } else {
    state.activeToolbar = 'h-main-toolbar' // if null, set default one
  }
}

export function setActiveOrderTab (state, orderTab) {
  state.activeOrderTab = orderTab
}

export function setEvent (state, event) {
  state.event = event
}

export function setSelectedOrders (state, orders) {
  state.selectedOrders = orders
}

export function setActiveCustomer (state, customer) {
  state.activeCustomer = customer
}

export function setMoreOrders (state, moreOrders) {
  state.moreOrders = moreOrders
}

/**
 * Reset state to its initial values
 * @param {any} state State
 */
export function resetState (state) {
  // Merge rather than replace so we don't lose observers
  // https://github.com/vuejs/vuex/issues/1118
  Object.assign(state, getInitialState())
}
