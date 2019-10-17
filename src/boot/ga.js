// Add Google Analytics with gtag.js
// More info at https://developers.google.com/analytics/devguides/collection/gtagjs

class GAnalytics {
  constructor (scope, trackingId) {
    this.url = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    this.trackingId = trackingId
    this.scope = scope
  }

  loadScript () {
    return new Promise((resolve, reject) => {
      const head = document.head || document.getElementsByTagName('head')[0]
      const script = document.createElement('script')
      script.async = true
      script.src = this.url
      script.charset = 'utf-8'
      head.appendChild(script)
      script.onload = resolve
      script.onerror = reject
    })
  }

  async init () {
    try {
      await this.loadScript()
    } catch (error) {
      console.warn('gtag.js cannot be loaded. Perhaps blocked by your Ad Blocker')
    }
    this.scope.dataLayer = this.scope.dataLayer || []
    this.gtag('js', new Date())
    this.gtag('config', this.trackingId, { 'send_page_view': false })
  }

  gtag () {
    this.scope.dataLayer.push(arguments)
  }

  onPageView (to) {
    this.config({
      page_path: `/${to.name}`,
      send_page_view: true
    })
  }

  config (options) {
    this.gtag('config', this.trackingId, options)
  }

  event (name, params) {
    this.gtag('event', name, params)
  }
}

export default async ({ router, Vue }) => {
  const ga = new GAnalytics(window, process.env.GA_MEASUREMENT_ID)
  await ga.init()
  router.afterEach(ga.onPageView.bind(ga))
  Vue.prototype.$ga = ga
}
