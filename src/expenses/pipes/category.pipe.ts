import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CategoryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, 'category valueeeee');

    const knownCategories = ['shopping', 'food', 'sport'];
    if (value && !knownCategories.includes(value)) {
      throw new BadRequestException(
        'unknown Category use shopping, food , sport',
      );
    }
    return value;
  }
}
