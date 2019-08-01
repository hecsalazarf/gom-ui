export function getInitialState () {
  return {
    /* Order */
    activeOrder: null,
    activeOrderTab: null,
    selectedOrders: [],
    moreOrders: true,

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
