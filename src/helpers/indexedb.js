/*
* IMPORTANT: This code can run on client-side only!
*/

export class IDBInitializer {
  static open (idbFactory, name, version, upgrade) {
    return new Promise((resolve, reject) => {
      const request = idbFactory.open(name, version)
      request.onerror = event => reject(event.target.error)
      request.onsuccess = event => resolve(event.target.result)
      request.onupgradeneeded = event => upgrade(event.target.result)
    })
  }
}

export class IDBStoreOps {
  constructor (store, db) {
    this.store = store
    this.db = db
  }

  add (item, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.store, 'readwrite')
      const request = tx.objectStore(this.store).add(item, key)
      request.onsuccess = ({ target }) => resolve(target.result)
      request.onerror = ({ target }) => reject(target.error)
    })
  }

  get (key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.store, 'readonly')
      const request = tx.objectStore(this.store).get(key)
      request.onsuccess = ({ target }) => resolve(target.result)
      request.onerror = ({ target }) => reject(target.error)
    })
  }

  put (item, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.store, 'readwrite')
      const request = tx.objectStore(this.store).put(item, key)
      request.onsuccess = ({ target }) => resolve(target.result)
      request.onerror = ({ target }) => reject(target.error)
    })
  }

  delete (key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.store, 'readwrite')
      const request = tx.objectStore(this.store).delete(key)
      request.onsuccess = ({ target }) => resolve(target)
      request.onerror = ({ target }) => reject(target.error)
    })
  }
}
