import * as Mali from 'mali'
import 'reflect-metadata'
import {EnumKeys} from './decorators'

export {Service, Method, Req, Context} from './decorators'

export function buildMiddleware(...services: object[]) {
  const middleware = {}
  for (const service of services) {
    const s = {}
    const proto = Object.getPrototypeOf(service)
    const methods: string[] = Reflect.getMetadata(EnumKeys.methods, proto)
    const name: string = Reflect.getMetadata(EnumKeys.name, service)
    for (const method of methods) {
      s[method] = async (ctx: Mali.Context) => {
        const ctxs = Reflect.getMetadata(EnumKeys.ctx, proto, method)
        const args = []
        if (ctxs) {
          for (const ctxIndex of ctxs) {
            args[ctxIndex] = ctx
          }
        }
        Reflect.getMetadata(EnumKeys.args, proto, method).forEach((argName, index) => {
          args[index] = ctx.req[argName]
        })
        ctx.res = await Reflect.getMetadata(EnumKeys.fn, proto, method).apply(service, args)
      }
      middleware[name] = s
    }
  }
  return middleware
}
