import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

/*
Demo code showing how to lazy-load translations
NOT IMPLEMENTED
*/

// class I18nLazyLoader {
//   constructor (i18n) {
//     this.i18n = i18n
//     this.loadedLanguages = [ i18n.locale ]
//   }

//   setI18nLanguage (lang) {
//     this.i18n.locale = lang
//     return lang
//   }

//   async loadLanguageAsync (lang) {
//     if (this.i18n.locale !== lang) {
//       if (!this.loadedLanguages.includes(lang)) {
//         const msgs = await import(`src/i18n/${lang}`)
//         this.i18n.setLocaleMessage(lang, msgs.default)
//         this.loadedLanguages.push(lang)
//         return this.setI18nLanguage(lang)
//       }
//       return this.setI18nLanguage(lang)
//     }
//     return lang
//   }
// }

export default async ({ app, Vue }) => {
  Vue.use(VueI18n)

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'es-mx',
    fallbackLocale: 'es-mx',
    messages
  })
}
