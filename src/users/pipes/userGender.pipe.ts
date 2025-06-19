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
    if (value && !knownGenders.includes(value)) {
      throw new BadRequestException('unknown gender');
    }

    return value;
  }
}
