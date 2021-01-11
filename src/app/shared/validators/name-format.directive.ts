
import { Directive }                from '@angular/core';
import { 
    AbstractControl,
    ValidatorFn,
    NG_VALIDATORS,
    Validator
} from '@angular/forms';

@Directive({
    selector: '[appForbiddenFormat]',
    providers: [{provide: NG_VALIDATORS, useExisting: NameFormatDirective, multi: true}]
  })
  export class NameFormatDirective implements Validator {
    validate(control: AbstractControl): {[key: string]: any} | null {
        if(!control.value){
            return null;
        }
        var isLowerCase = control.value == control.value.toLowerCase();
        var hasNoWhiteSpace = !/\s/.test(control.value);
        return isLowerCase && hasNoWhiteSpace ? null : { forbiddenFormat: true };
    }
}