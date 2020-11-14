import "reflect-metadata";

const KEY_LIMITER = "LIMITER";
const KEY_LIMITER_SET_Listener = "LIMITER_SET_Listener"
export const KEY_Unregistered = "Unregistered"
let Send = 0;

export class DataAnnotations {

  public static IsValid(obj) {
    const map = {} as any;
    for (const key in obj) {
      const err = this.Valid(obj, key);
      if (err.length) {
        map[key] = err;
      }
    }

    return { Success: !Object.keys(map).length, Error: map };
  }

  private static Valid(obj, key) {
    const limiterObj = Reflect.getMetadata(KEY_LIMITER, obj, key) as {};
    if (!limiterObj) {
      return [];
    }
    const table: string[] = []
    for (let limiterKey in limiterObj) {
      const limiter = limiterObj[limiterKey];
      const msg = limiter(obj[key], key);
      if (msg) {
        table.push(msg);
      }
    }

    return table;
  }


  public static DefineLimiter(limiterKey, target, propertyKey: string, callBack: (arg, propertyKey: string) => string) {
    const newProertyKey = `_${Send++}${propertyKey}`;
    Object.defineProperty(target, newProertyKey, { configurable: true, writable: true, value: target[propertyKey] ?? '' });
    
    const setter = value => {
      target[newProertyKey] = value;
      const f = this.GetChangeListener(target, propertyKey);
      f.forEach(r => {
        r(value);
      })
    }

    const getter = () => {
      return target[newProertyKey];
    }

    Object.defineProperty(target, propertyKey, { configurable: true, enumerable: true, set: setter, get: getter });
    const limiter = Reflect.getMetadata(KEY_LIMITER, target, propertyKey) as any ?? {};
    limiter[limiterKey] = callBack;
    Reflect.defineMetadata(KEY_LIMITER, limiter, target, propertyKey);

    this.AddtoJsonFun(target);
  }

  private static AddtoJsonFun(target) {
    if(target["toJSON"]){
      return;
    }

    Object.defineProperty(target, "toJSON", {
      configurable: true,
      value: () => {
        const jsonObj = {} as any;
        for (let x in target) {
          jsonObj[x] = target[x];
        }
        return jsonObj
      }
    })
  }


  public static SetChangeListener(target, propertyKey: string, callBack: (s) => void) {
    var fun = this.GetChangeListener(target, propertyKey);
    fun.push(callBack);
    Reflect.defineMetadata(KEY_LIMITER_SET_Listener, fun, target, propertyKey);
  }

  private static GetChangeListener(target, propertyKey: string) {
    return Reflect.getMetadata(KEY_LIMITER_SET_Listener, target, propertyKey) ?? [];
  }

  public static LimiterInit(target){
    var limiter = this.GetRegisteredLimiter(target);
    limiter.forEach(element => {
      this.DefineLimiter(element.Key,target,element.PropertyKey,element.CallBack);
    });
  }
  

  public static DefineDecoratorsLimiter(limiterKey, target, propertyKey: string, callBack: (arg, propertyKey: string) => string){
    var limiter = this.GetRegisteredLimiter(target);
    limiter.push(new Limiter(limiterKey,propertyKey,callBack));
    Object.defineProperty(target, KEY_Unregistered, { configurable: true, writable: true, value: limiter });
  }

  private static GetRegisteredLimiter(target):Limiter[]{
    return target[KEY_Unregistered] ?? [];
  }


}

export class Limiter{
  constructor(key:string,propertyKey:string,callBack:(arg, propertyKey: string) => string){
    this.Key = key;
    this.CallBack = callBack;
    this.PropertyKey = propertyKey
  }
  Key:string;
  PropertyKey: string;
  CallBack: (arg, propertyKey: string) => string;
}
