import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UserGenderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const knownGenders = ['male', 'female', 'other'];
    console.log(value, 'gender from pipe');
    if (value === undefined || value === null) {
      return value;
    }
    if (typeof value === 'string' && value.trim() === '') {
      throw new BadRequestException('Gender query field should not be empty');
    }
    if (value && !knownGenders.includes(value)) {
      throw new BadRequestException('unknown gender');
    }

    return value;
  }
}
