import { date } from 'quasar'

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
      throw new Error(`Property ${prop} is not defined in schema ${target.constructor.name}`)
    }
  }
}

export class BaseModel {
  constructor () {
    this.initial = {}
    this.delta = {}
  }

  resolveString (accessor) {
    const resolver = {
      get (prop) {
        if (typeof this[prop].type === 'function') {
          return ''
        }
        return this[prop]
      },
      set (prop, value) {
        if (value !== this.initial[prop]) this.delta[prop] = value
        else delete this.delta[prop]
        this[prop] = value
      }
    }
    return resolver[accessor].bind(this)
  }

  resolveDate (accessor) {
    const resolver = {
      get (prop) {
        if (typeof this[prop].type === 'function') {
          return ''
        } else if (typeof this[prop] === 'string') {
          return this[prop]
        }
        return date.formatDate(this[prop], this.schema[prop].options.format)
      },
      set (prop, value) {
        if (!date.isSameDate(value, this.initial[prop])) this.delta[prop] = value
        else delete this.delta[prop]
        this[prop] = value
      }
    }
    return resolver[accessor].bind(this)
  }

  resolveArray (accessor) {
    const resolver = {
      get (prop) {
        if (typeof this[prop].type === 'function') {
          return []
        } else if (typeof this[prop] === 'string') {
          return [this[prop]]
        }
        return this[prop]
      },
      set (prop, value) {
        if (value !== this.initial[prop]) this.delta[prop] = value[value.length - 1]
        else delete this.delta[prop]
        this[prop] = value[value.length - 1]
      }
    }
    return resolver[accessor].bind(this)
  }

  getResolverByType (type, accessor) {
    switch (type.name) {
      case 'String':
        return this.resolveString(accessor)
      case 'Date':
        return this.resolveDate(accessor)
      case 'Array':
        return this.resolveArray(accessor)
      default:
        return this.resolveString(accessor)
    }
  }

  resolve (prop, value) {
    let resolver
    if (typeof value === 'undefined') {
      resolver = this.getResolverByType(this.schema[prop].type, 'get')
    } else {
      resolver = this.getResolverByType(this.schema[prop].type, 'set')
    }
    return resolver(prop, value)
  }
}

export function Model (ModelTemplate) {
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
      Target.prototype = Object.create(new BaseModel(), Object.getOwnPropertyDescriptors(Target.prototype))
      const proxy = new Proxy(new Target(), handler)
      Object.assign(proxy.initial, initialData)
      Object.assign(proxy, initialData)
      return proxy
    }
  })
}
