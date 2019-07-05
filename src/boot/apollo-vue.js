import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

/* New instance of apollo client for SSR mode */
function createApolloClient (ssr = false) {
  const httpLink = createHttpLink({
    // Absolute URL here
    uri: '/api/graphql',
    // credentials: 'include',
    headers: {
      'Accept': 'application/json'/* ,
      'X-Csrf-Token': Cookies.get('csrf-token') */
    }
  })

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
  if (!ssr) {
    if (typeof window !== 'undefined') {
      const state = window.__APOLLO_STATE__
      if (state) {
        // If you have multiple clients, use `state.<client_id>`
        cache.restore(state.defaultClient)
      }
    }
  }

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    ...(ssr ? {
      // Set this on the server to optimize queries when SSR
      ssrMode: true
    } : {
      // This will temporary disable query force-fetching
      ssrForceFetchDelay: 100
    })
  })

  return apolloClient
}

export default async ({ app, Vue }) => {
  Vue.use(VueApollo)
  const apolloClient = createApolloClient()
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient
    /* errorHandler (error) {
      console.log('Vue-Apollo global error handler', error)
    } */
  })
  app.apolloProvider = apolloProvider
}
