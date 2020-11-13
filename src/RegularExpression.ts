import { DataAnnotations } from './DataAnnotations';

export function RegularExpressionValidFactory(reg:RegExp, errMsg?: string) {
    return (arg, propertyKey: string) => {
        const ErrMsg = errMsg ?? `The field ${propertyKey} must match the regular expression '${reg}'.`
        switch (typeof arg) {
            case "string":
                return reg.test(arg) ? null : ErrMsg;
            default:
                return null;
        }
    }
}

export function RegularExpression<T>(reg:RegExp, option?:RegularExpressionOption<T>) {
    return (target: any, propertyKey: string) => {
        const valid = RegularExpressionValidFactory(reg,option?.ErrorMsg);
        DataAnnotations.DefineLimiter(target, propertyKey, valid);
        if(!option?.CallBack){
            return;
        }
        DataAnnotations.SetChangeListener(target, propertyKey, (s) => {
            option.CallBack(target, valid(s, propertyKey))
        })
    }
}

export class RegularExpressionOption<T>{
    ErrorMsg?:string
    CallBack?:(arg:T, e: string) => void
}