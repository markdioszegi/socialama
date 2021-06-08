import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ async: true })
export class IsUniqueExistConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const entity = args.object[`class_entity_${args.property}`]
    // TODO for updates
    return entity.count({ [args.property]: value }).then((count) => count < 1)
  }
}

export function IsUnique(entity: Function, query = (req: any) => {}, validationOptions?: ValidationOptions) {
  validationOptions = { ...{ message: '$value is already in use.' }, ...validationOptions }
  return function (object: Object, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueExistConstraint,
    })
  }
}
