const CustomHandlers = [
  'BP_WITH_ACTIVE_ORDERS'
]

export class GraphQlErrors {
  /**
   * Validates if given error has custom handler so that error handler
   * does not consider it as a generic error
   * @param {string} error Error code
   */
  static hasCustomHandler (error) {
    return CustomHandlers.includes(error)
  }
}
