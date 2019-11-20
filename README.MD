## example
```typescript
import {Service, Method, Req, buildMiddleware} from 'mali-decorator'
import {Mali} from 'mali'
import {promises, LookupAddress} from 'dns'

@Service()
export class DNSService {
  @Method()
  public async lookup(@Req('hostname') hostname: string): Promise<LookupAddress> {
    return promises.lookup(hostname)
  }

  @Method('Resolve')
  public async resolve(@Req() data: object): Promise<{addresses: string[]}>{
    return {
      addresses: await promises.resolve(data['hostname'])
    }
  }
}

const mali = new Mali('./index.proto')
const middleware = buildMiddleware(new DNSService())
mali.use(middleware)
mali.start(`0.0.0.0:4000`)
```
```proto
syntax='proto3';

message LookupReq {
    string hostname = 1;
}

message LookupRes {
    string address = 1;
    uint32 family = 2;
}

message ResolveReq {
    string hostname = 1;
}

message ResolveRes {
    repeated string addresses = 1;
}

service DNSService {
    rpc lookup(LookupReq) returns (LookupRes)
    rpc Resolve(ResolveReq) returns (ResolveRes)
}
```
