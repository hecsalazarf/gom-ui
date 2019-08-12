export function getInitialState () {
  return {
    /* Order */
    activeOrder: null,
    activeOrderTab: null,
    selectedOrders: [],
    moreOrders: false, // initial state set to false (Fix #41)

    /* Customer */
    activeCustomer: null,

    /* Toolbar */
    activeToolbar: null,

    /* Event */
    event: {
      target: null,
      method: null,
      args: null
    }
  }
}

export default getInitialState()
