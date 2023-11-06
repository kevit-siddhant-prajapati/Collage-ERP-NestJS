import { IsString, Validate, ValidateIf, ValidationOptions } from 'class-validator';
import { Transform } from 'class-transformer';

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
