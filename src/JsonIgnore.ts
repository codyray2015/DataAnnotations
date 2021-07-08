
const JSON_IGNORE_METADATA = "JsonIgnorenjiadv"

export function JsonIgnore(target: any, propertyKey: string) {
    Reflect.defineMetadata(JSON_IGNORE_METADATA, true, target, propertyKey);
}

export function isJsonIgnore(target: any, propertyKey: string){
   return !!Reflect.getMetadata(JSON_IGNORE_METADATA,target,propertyKey);
}