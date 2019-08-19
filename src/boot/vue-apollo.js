import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { ErrorHandlers } from 'src/helpers'
const { handleGraphQlErrors, handleNetworkErrors } = ErrorHandlers

class ApolloClientProvider {
  constructor (router, ssr = false) {
    this.ssr = ssr
    this.router = router
  }

  createClient () {
    // Create afterware to handle Apollo errors globally.
    // See https://www.apollographql.com/docs/react/features/error-handling/
    const errorLink = onError(({ graphQLErrors, networkError, operation, response }) => {
      console.error(`[Operation error]: ${operation.operationName}`)
      if (graphQLErrors) {
        handleGraphQlErrors.call(this.router.app, graphQLErrors)
      }
      if (networkError) {
        handleNetworkErrors.call(this.router.app, networkError)
      }
    })

    // Create middleware to set CSRF header.
    // See https://www.apollographql.com/docs/react/advanced/network-layer/
    const csrfMiddleware = new ApolloLink((operation, forward) => {
      const { $q } = this.router.app // Extract quasar instance
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          'X-Csrf-Token': $q.cookies.get('csrf-token')
        }
      }))
      return forward(operation)
    })

    // Create HTTP link to get GraphQL results over a network using HTTP fetch
    // See https://www.apollographql.com/docs/link/links/http/
    const httpLink = createHttpLink({
      // Absolute URL here
      uri: '/api/graphql',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'same-origin'
    })

    // Create the subscription websocket link
    // https://www.apollographql.com/docs/link/links/ws/
    const wsLink = new WebSocketLink({
      uri: process.env.WS_ENDPOINT,
      options: {
        reconnect: true, // automatic reconnect in case of connection error
        lazy: true // connects only when first subscription created, and delay the socket initialization
      }
    })

    // Additive link composition for HTTP transport
    // See https://www.apollographql.com/docs/link/composition/#additive-composition
    const httpTransportLink = ApolloLink.from([
      errorLink,
      csrfMiddleware,
      httpLink
    ])

    // Directional Composition
    // See https://www.apollographql.com/docs/link/composition/#directional-composition
    const link = split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
      },
      wsLink, // subscriptions over websockets
      httpTransportLink
    )

    const cache = new InMemoryCache({
      // dataIdFromObject() changes the cache normalization key,
      // which results in the correct cache automatic updates
      // https://www.apollographql.com/docs/react/advanced/caching/#normalization
      dataIdFromObject: object => {
        if (object.__typename && object.uid !== undefined) {
          return `${object.__typename}:${object.uid}`
        }
        return null
      }
    })

    // If on the client, recover the injected state
    if (!this.ssr) {
      if (typeof window !== 'undefined') {
        const state = window.__APOLLO_STATE__
        if (state) {
          // If you have multiple clients, use `state.<client_id>`
          cache.restore(state.defaultClient)
        }
      }
    }
    this.client = new ApolloClient({
      link,
      cache,
      ...(this.ssr ? {
        // Set this on the server to optimize queries when SSR
        ssrMode: true
      } : {
        // This will temporary disable query force-fetching
        ssrForceFetchDelay: 100
      })
    })
    // create prop in Apollo client to close socket connection on log out
    this.client.subscriptionClient = wsLink.subscriptionClient
    return this.client
  }
}

export default async ({ app, Vue, router }) => {
  Vue.use(VueApollo)

  app.apolloProvider = new VueApollo({
    defaultClient: new ApolloClientProvider(router).createClient()
  })
}
