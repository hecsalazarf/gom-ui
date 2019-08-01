import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { Session } from 'src/helpers'
const { logout, notifyOnError } = Session

class ApolloClientProvider {
  constructor (router, ssr = false) {
    this.ssr = ssr
    this.router = router
  }

  createClient () {
    /*
    Create afterware to handle Apollo errors globally.
    See https://www.apollographql.com/docs/react/features/error-handling/
    */
    const errorLink = onError(({ graphQLErrors, networkError, operation, response }) => {
      console.error(`[Operation error]: ${operation.operationName}`)
      if (graphQLErrors) {
        notifyOnError.call(this.router.app)
      }
      if (networkError) {
        if (networkError.result && networkError.result.code && networkError.result.code === 'jwt_error') {
          logout.call(this.router.app)
        } else {
          notifyOnError.call(this.router.app)
        }
      }
    })

    /*
    Create middleware to set CSRF header.
    See https://www.apollographql.com/docs/react/advanced/network-layer/
    */
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

    /*
    The Apollo link for GraphQL network.
    See https://www.apollographql.com/docs/link/links/http/
    */
    const httpLink = createHttpLink({
      // Absolute URL here
      uri: '/api/graphql',
      headers: {
        'Accept': 'application/json'
      }
    })

    /*
    Additive link composition
    See https://www.apollographql.com/docs/link/composition/
    */
    const link = ApolloLink.from([
      errorLink,
      csrfMiddleware,
      httpLink
    ])

    const cache = new InMemoryCache({
      /*
      dataIdFromObject() changes the cache normalization key,
      which results in the correct cache automatic updates
      https://www.apollographql.com/docs/react/advanced/caching/#normalization
       */
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
    return this.client
  }
}

export default async ({ app, Vue, router }) => {
  Vue.use(VueApollo)

  app.apolloProvider = new VueApollo({
    defaultClient: new ApolloClientProvider(router).createClient()
  })
}