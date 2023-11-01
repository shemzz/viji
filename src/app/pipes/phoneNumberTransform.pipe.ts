import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneNoTransform',
    standalone: true
})
export class PhoneNumberTransform implements PipeTransform {
    transform(value: string): string {
    if (value.startsWith('+234')) {
      return '0' + value.slice(4);
    }
    return value;
  }
}
