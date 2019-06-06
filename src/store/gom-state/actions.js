export function changeActiveOrder (context, orderId) {
  context.commit('setActiveOrder', orderId)
}

export function changeActiveToolbar (context, toolbar) {
  context.commit('setActiveToolbar', toolbar)
}
