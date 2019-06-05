export function changeActiveOrder (context, orderId) {
  context.commit('setActiveOrder', orderId)
}
