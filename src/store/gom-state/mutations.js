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
