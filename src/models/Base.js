// eslint-disable-next-line no-unused-vars
const handler = {
  get (target, prop, receiver) {
    if (Object.prototype.hasOwnProperty.call(target.schema, prop)) {
      return target.resolve(prop)
    } else {
      const propValue = Reflect.get(...arguments)
      return typeof propValue === 'function' ? propValue.bind(target) : propValue
    }
  },
  set (target, prop, value) {
    if (Object.prototype.hasOwnProperty.call(target.schema, prop)) {
      target.resolve(prop, value)
      return true
    } else {
      console.error(`Property ${prop} is not defined in schema ${target.constructor.name}`)
      return true
    }
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
        if (typeof this[prop] === 'undefined') {
          // TODO
        }
        return this[prop]
      },
      set (prop, value) {
        if (value !== this[prop]) this.delta[prop] = value
        else delete this.delta[prop]
        this[prop] = value
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

export function Model (ModelTemplate) {
  ModelTemplate.prototype = Object.create(new BaseModel(), Object.getOwnPropertyDescriptors(ModelTemplate.prototype))
  Object.defineProperty(ModelTemplate.prototype, 'schema', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: {
      ...new ModelTemplate()
    }
  })
  return new Proxy(ModelTemplate, {
    construct (Target, args) {
      const initialData = args[0] || {}
      const proxy = new Proxy(new Target(), handler)
      Object.assign(proxy, initialData)
      return proxy
    }
  })
}
