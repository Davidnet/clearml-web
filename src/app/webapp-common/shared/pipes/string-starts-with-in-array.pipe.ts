import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'stringStartsWithInArray',
  standalone: true
})
export class StringStartsWithInArrayPipe implements PipeTransform {

  transform(value: string, stingsArr: string[] = []): boolean {
    if (!value) {
      return false;
    }
    return stingsArr?.some(item => item.startsWith(value));
  }

}
