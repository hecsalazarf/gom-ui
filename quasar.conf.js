// Configuration for your app
const fs = require('fs')
const env = require('./env')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios',
      'addressbar-color',
      'vue-apollo',
      'auth',
      'defaults'
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
        'QChip'
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
      }
      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
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
      }
    },

    devServer: {
      https: {
        key: fs.readFileSync('./certs/localhost+10-key.pem'),
        cert: fs.readFileSync('./certs/localhost+10.pem'),
        ca: fs.readFileSync('./certs/rootCA.pem')
      },
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

    pwa: {
      workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        name: 'Gom',
        short_name: 'Gom',
        description: 'Make your orders with the best app',
        display: 'standalone',
        orientation: 'portrait',
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
