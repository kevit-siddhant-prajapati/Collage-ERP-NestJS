import { IsString, Validate, ValidateIf, ValidationOptions } from 'class-validator';
import { Transform } from 'class-transformer';
/**
 * @description : this pipe is usefull to check the id of student weather it is string or not
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @param {ValidationOptions} [validationOptions]
 * @returns {*} 
 */
export function IsStringOrUndefined(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    ValidateIf((object, value) => typeof value === 'undefined' || typeof value === 'string', {
      message: `${propertyName} must be a string or undefined.`,
    })(object, propertyName);

    Transform((value) => (typeof value === 'string' ? value : undefined), { toClassOnly: true })(
      object,
      propertyName
    );

    IsString(validationOptions)(object, propertyName);
  };
}
