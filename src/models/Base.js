const handler = {
  get (target, prop, receiver) {
    if (prop in target.schema) {
      return target.resolve(prop)
    } else {
      const propValue = Reflect.get(...arguments)
      return typeof propValue === 'function' ? propValue.bind(target) : propValue
    }
  },
  set (target, prop, value) {
    prop in target.schema ? target.resolve(prop, value) : Reflect.set(...arguments)
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
      resolver = this.getResolverByType(this.schema[prop], 'get')
    } else {
      resolver = this.getResolverByType(this.schema[prop], 'set')
    }
    return resolver(prop, value)
  }
}

export function Model (interactionLayer, schema) {
  if (typeof interactionLayer.prototype.schema === 'undefined') {
    // Target.prototype.schema = schema
    Object.defineProperty(interactionLayer.prototype, 'schema', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: schema
    })
  }
  return new Proxy(interactionLayer, {
    construct (Target, args) {
      const initialData = args[0] || {}
      const instance = new Target(...args)

      for (const prop in schema) {
        Object.defineProperty(instance.model, prop, {
          // Vue requires these descriptors in order to be reactive
          configurable: true,
          enumerable: true,
          writable: true,
          value: initialData[prop] || ''
        })
      }
      return new Proxy(instance, handler)
    }
  })
}
