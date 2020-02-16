const handler = {
  get (target, prop, receiver) {
    if (Object.prototype.hasOwnProperty.call(target, prop)) {
      return target.resolve(prop)
    } else {
      const propValue = Reflect.get(...arguments)
      return typeof propValue === 'function' ? propValue.bind(target) : propValue
    }
  },
  set (target, prop, value) {
    Object.prototype.hasOwnProperty.call(target, prop) ? target.resolve(prop, value) : Reflect.set(...arguments)
    return true
  }
}

export class BaseModel {
  constructor () {
    this.model = {}
    this.delta = {}
  }

  resolveString (accessor) {
    const resolver = {
      get (prop) {
        if (typeof this.delta[prop] !== 'undefined') {
          return this.delta[prop]
        } else if (typeof this.model[prop] !== 'undefined') {
          return this.model[prop]
        } else {
          return ''
        }
      },
      set (prop, value) {
        if (value !== this.model[prop]) this.delta[prop] = value
        else delete this.delta[prop]
      }
    }
    return resolver[accessor].bind(this)
  }

  getResolverByType (type, accessor) {
    switch (type.name) {
      case 'String':
        return this.resolveString(accessor)
      default:
        return this.resolveString(accessor)
    }
  }

  resolve (prop, value) {
    let resolver
    if (typeof value === 'undefined') {
      resolver = this.getResolverByType(this[prop], 'get')
    } else {
      resolver = this.getResolverByType(this[prop], 'set')
    }
    return resolver(prop, value)
  }
}

export function Model (interactionLayer) {
  return new Proxy(interactionLayer, {
    construct (Target, args) {
      const initialData = args[0] || {}
      Target.prototype = Object.create(new BaseModel(), Object.getOwnPropertyDescriptors(Target.prototype))
      const instance = new Target(...args)

      for (const prop in initialData) {
        if (Object.prototype.hasOwnProperty.call(instance, prop)) {
          Object.defineProperty(instance.model, prop, {
            // Vue requires these descriptors in order to be reactive
            configurable: true,
            enumerable: true,
            writable: true,
            value: initialData[prop]
          })
        }
      }
      return new Proxy(instance, handler)
    }
  })
}
