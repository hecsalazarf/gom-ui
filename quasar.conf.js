// Configuration for your app
const fs = require('fs')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios',
      'addressbar-color',
      'vue-apollo',
      'auth'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
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
        'QField'
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
          position: 'bottom-left',
          timeout: 2500,
          textColor: 'white',
          actions: [{ icon: 'close', color: 'white' }]
        },
        loading: {
          delay: 400,
          sanitize: true,
          backgroundColor: 'primary'
        }
      }
      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      devtool: 'source-map',
      env: ctx.dev
        ? { // so on dev we'll have
          VAPID_KEY: JSON.stringify('BJo1ZeE62MZqVkZN8g9TOSFXOCtxmpmejfId8JpLT5C52ASUqhabfpVpHqQrySWhD0PCgEWohR1vKpbRJ48boWA')
        }
        : { // and on build (production):
          VAPID_KEY: JSON.stringify('BJo1ZeE62MZqVkZN8g9TOSFXOCtxmpmejfId8JpLT5C52ASUqhabfpVpHqQrySWhD0PCgEWohR1vKpbRJ48boWA')
        },
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
          target: 'http://192.168.0.2:3000',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
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
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
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
