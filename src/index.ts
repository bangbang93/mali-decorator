import * as Mali from 'mali'
import 'reflect-metadata'
import {EnumKeys} from './decorators'

export {Service, Method, Req, Context} from './decorators'

export function buildMiddleware(...services: object[]) {
  const middleware = {}
  for (const service of services) {
    const s = {}
    const proto = Reflect.getPrototypeOf(service)
    const methods: string[] = Reflect.getMetadata(EnumKeys.methods, proto)
    const name: string = Reflect.getMetadata(EnumKeys.name, proto.constructor)
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
        ctx.res = await service[method](...args)
      }
      middleware[name] = s
    }
  }
  return middleware
}
