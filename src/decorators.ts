import 'reflect-metadata'

export enum EnumKeys {
  name = 'malid:name',
  methods = 'malid:methods',
  args = 'malid:args',
  ctx = 'malid:ctx',
  fn = 'malid:fn',
}

export function Service(name?: string) {
  return (constructor: Function) => {
    if (!name) name = constructor.name
    Reflect.defineMetadata(EnumKeys.name, name, constructor)
  }
}

export function Method() {
  return (target: object, name: string) => {
    Reflect.defineMetadata(EnumKeys.fn, target[name].bind(target), target, name)

    const methods: string[] = Reflect.getMetadata(EnumKeys.methods, target) || []
    methods.push(name)
    Reflect.defineMetadata(EnumKeys.methods, methods, target)
  }
}

export function Req(key?: string) {
  return (target: object, name: string, index: number) => {
    const args = Reflect.getMetadata(EnumKeys.args, target, name) || []
    args[index] = key || null
    Reflect.defineMetadata(EnumKeys.args, args, target, name)
  }
}

export function Context() {
  return (target: object, name: string, index: number) => {
    const ctx = Reflect.getMetadata(EnumKeys.ctx, target, name) || []
    ctx.push(index)
    Reflect.defineMetadata(EnumKeys.ctx, ctx, target, name)
  }
}
