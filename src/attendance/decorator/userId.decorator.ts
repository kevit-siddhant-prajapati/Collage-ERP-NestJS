import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';

export function IsUserId(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isUserId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Types.ObjectId.isValid(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ObjectId.`;
        },
      },
    });
  };
}
