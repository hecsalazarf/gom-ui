// Configuration for your app
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const env = require('./env')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      { server: false, path: 'ga' },
      'i18n',
      'axios',
      'addressbar-color',
      'vue-apollo',
      'auth',
      'defaults',
      { server: false, path: 'updates' },
      { server: false, path: 'idb' }
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons', // optional, you are not bound to it
      'fontawesome-v5'
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'eva-icons'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QTabs',
        'QRouteTab',
        'QAvatar',
        'QForm',
        'QInput',
        'QSpinnerBars',
        'QFooter',
        'QBar',
        'QPageSticky',
        'QMenu',
        'QList',
        'QSlideItem',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QSeparator',
        'QPullToRefresh',
        'QToggle',
        'QCheckbox',
        'QCircularProgress',
        'QExpansionItem',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QBadge',
        'QTabPanels',
        'QTabPanel',
        'QTab',
        'QSpace',
        'QSelect',
        'QTooltip',
        'QDialog',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QField',
        'QBanner',
        'QChip',
        'QVirtualScroll',
        'QColor',
        'QDate',
        'QTime',
        'QPopupProxy',
        'QEditor'
      ],

      directives: [
        'Ripple',
        'ClosePopup',
        'TouchHold'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'AddressbarColor',
        'Cookies',
        'Loading',
        'BottomSheet'
      ],

      config: {
        notify: {
        },
        loading: {
        }
      },
      // iconSet: 'ionicons-v4'
      lang: 'es' // Quasar language
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      devtool: 'source-map',
      env: env(ctx),
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
        cfg.module.rules.push({ // this allows to load Graphql files
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader'
        })
      },
      chainWebpack (chain) {
        chain.plugin('html-webpack2')
          .use(HtmlWebpackPlugin, [{
            title: 'Gom nojs fallback',
            filename: 'nojs.html',
            template: 'src/nojs.template.html',
            minify: {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true
            },
            chunksSortMode: 'none',
            inject: true,
            cache: true
          }])
          .after('html-webpack')
      }
    },

    devServer: {
      https: ctx.dev ? {
        // Cert files are for dev environments only, since they cause build
        // errors as they are not part of the version-control repository.
        key: fs.readFileSync('./certs/localhost+10-key.pem'),
        cert: fs.readFileSync('./certs/localhost+10.pem'),
        ca: fs.readFileSync('./certs/rootCA.pem')
      } : false,
      // port: 8080,
      open: false, // opens browser window automatically
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/api': {
          target: 'http://172.18.0.1:3000',
          changeOrigin: true,
          ws: true, // proxy websockets
          pathRewrite: {
            '^/api': ''
          },
          xfwd: true // add x-forward headers
        }
      }
    },

    // animations: 'all', // --- includes all animations
    animations: [
      'fadeIn',
      'fadeOut',
      'slideOutUp',
      'slideInUp'
    ],

    ssr: {
      pwa: false
    },

    htmlVariables: {
      title: 'Gom',
      description: 'Conecta con tus clientes. Tus pedidos de manera fácil y rápida.',
      keywords: 'pedidos, clientes, catálogo, comprar, ordenar'
    },

    pwa: {
      workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        name: 'Gom',
        short_name: 'Gom',
        description: 'Make your orders with the best app',
        display: 'standalone',
        // orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#37474f',
        start_url: '/',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
