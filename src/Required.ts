import { DataAnnotations } from './DataAnnotations';

const KEY = "Required";

function RequiredValidFactory(errorMsg?) {
    return (arg, propertyKey): string => {
        const ErrorMsg = errorMsg ?? `The ${propertyKey} field is required`
        switch (typeof arg) {
            case "string":
                return arg.trim().length == 0 ? ErrorMsg : null;
            case "undefined":
                return ErrorMsg;
            default:
                return null;
        }
    }
}

export function Required<T>(errorMsg: string):(target: any, propertyKey: string) => void
export function Required<T>(target: any, propertyKey: string):void
export function Required<T>(a: any | string, b?: string) {
    if (typeof a === "string") {
        return _Required_msg(a);
    }
    _Required(a, b as string);
}

export function RequiredFactory<T>(errorMsg: string, callBack?: (arg:T, e: string) => void):(target: any, propertyKey: string) => void{
    return (target: any, propertyKey: string) => {
        const valid = RequiredValidFactory(errorMsg);
        DataAnnotations.DefineLimiter(KEY,target, propertyKey, valid);
        if (!callBack) {
            return;
        }
        DataAnnotations.SetChangeListener(target, propertyKey, (s) => {
            callBack(target, valid(s, propertyKey))
        })


    };
}

function _Required(target: any, propertyKey: string) {
    DataAnnotations.DefineDecoratorsLimiter(KEY,target, propertyKey, RequiredValidFactory());
}

function _Required_msg<T>(errorMsg: string) {
    return (target: any, propertyKey: string) => {
        const valid = RequiredValidFactory(errorMsg);
        DataAnnotations.DefineDecoratorsLimiter(KEY,target, propertyKey, valid);
    }
}
