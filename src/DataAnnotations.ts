import "reflect-metadata";

const KEY_LIMITER = "LIMITER";
const KEY_LIMITER_SET_Listener = "LIMITER_SET_Listener"

export class DataAnnotations{

  public static IsValid(obj) {
    const map = {} as any;
    for (const key in obj) {
      const err = this.Valid(obj, key);
      if (err.length) {
        map[key] = err ;
      }
    }
    
    return { Success: !Object.keys(map).length, Error: map };
  }

  private static Valid(obj, key) {
    const limiter = Reflect.getMetadata(KEY_LIMITER, obj, key) as ((arg, propertyKey: string) => string)[];
    if (!limiter) {
      return [];
    }
    const table: string[] = []
    limiter.forEach(element => {
      const msg = element(obj[key], key);
      if (msg) {
        table.push(msg);
      }
    });
    return table;
  }
  
  public static DefineLimiter(target, propertyKey: string, callBack: (arg, propertyKey: string) => string) {
    const newProertyKey = `_${propertyKey}`;
    Object.defineProperty(target, newProertyKey, { configurable: true, writable: true, value: '' });
  
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
    const limiter = Reflect.getMetadata(KEY_LIMITER, target, propertyKey) as Function[] ?? [];
    limiter.push(callBack);
    Reflect.defineMetadata(KEY_LIMITER, limiter, target, propertyKey);
    this.AddtoJsonFun(target);
  }

  private static AddtoJsonFun(target) {
    Object.defineProperty(target, "toJSON", {
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

}