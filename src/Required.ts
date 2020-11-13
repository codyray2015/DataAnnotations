import { DataAnnotations } from './DataAnnotations';

export function RequiredValidFactory(errorMsg?) {
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

export function Required<T>(errorMsg: string, callBack?: (arg:T, e: string) => void)
export function Required<T>(target: any, propertyKey: string)
export function Required<T>(a: any | string, b?: string | ((arg, e: string) => void)) {
    console.log(this);

    if (typeof a === "string") {
        return _Required_msg(a, b as (e: string) => void);
    }
    _Required(a, b as string);
}

function _Required(target: any, propertyKey: string) {
    DataAnnotations.DefineLimiter(target, propertyKey, RequiredValidFactory());
}

function _Required_msg<T>(errorMsg: string, callBack?: (arg:T, e: string) => void) {
    return (target: any, propertyKey: string) => {
        const valid = RequiredValidFactory(errorMsg);
        DataAnnotations.DefineLimiter(target, propertyKey, valid);
        if (!callBack) {
            return;
        }
        DataAnnotations.SetChangeListener(target, propertyKey, (s) => {
            callBack(target, valid(s, propertyKey))
        })


    }
}
