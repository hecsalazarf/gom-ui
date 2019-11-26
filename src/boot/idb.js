import { IDBInitializer, IDBStoreOps } from 'src/helpers/indexedb'
import { IDBStorage } from 'src/constants/app'

export default async ({ Vue }) => {
  if (!window.indexedDB) {
    throw new Error('Cannot create app DB: IndexedDB not supported')
  }
  const appDB = await IDBInitializer.open(window.indexedDB, process.env.IDB_NAME, process.env.IDB_VERSION, db => {
    if (!db.objectStoreNames.contains(IDBStorage.PROFILE)) {
      db.createObjectStore(IDBStorage.PROFILE/*,  { keyPath: 'id' } */)
    }
  })
  const idb = {
    profile: new IDBStoreOps(IDBStorage.PROFILE, appDB)
  }
  Vue.prototype.$idb = idb
}
