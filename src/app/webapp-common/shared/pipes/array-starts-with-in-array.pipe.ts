import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrayIncludedInArray',
  standalone: true
})
export class ArrayIncludedInArrayPipe implements PipeTransform {

  transform(values: string[], stingsArr: string[] = []): boolean {
    if (!values) {
      return false;
    }
    return values.some(value => stingsArr?.includes(value));
  }

}
