import { DataAnnotations } from './DataAnnotations';

export function RangeValidFactory(min: number, max: number, errMsg?: string) {
    return (arg, propertyKey: string) => {
        const ErrMsg = errMsg ?? `The field ${propertyKey} must be between ${min} and ${max}.`
        let x: number = 0;
        switch (typeof arg) {
            case "string":
                x = new Number(arg).valueOf();
                break;
            case "number":
                x = arg;
                break
            default:
                return null;
        }

        if (x < min || x > max) {
            return ErrMsg;
        }
        return null;
    }
}

export function Range<T>(min: number, max: number, option?:RangeOption<T>) {
    return (target: any, propertyKey: string) => {
        const valid = RangeValidFactory(min,max,option?.ErrorMsg);
        DataAnnotations.DefineLimiter(target, propertyKey, valid);
        if(!option?.CallBack){
            return;
        }
        DataAnnotations.SetChangeListener(target, propertyKey, (s) => {
            option.CallBack(target, valid(s, propertyKey))
        })
    }
}

export class RangeOption<T>{
    ErrorMsg?:string
    CallBack?:(arg:T, e: string) => void
}