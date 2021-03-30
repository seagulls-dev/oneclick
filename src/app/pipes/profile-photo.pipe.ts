import { Pipe, PipeTransform } from '@angular/core';

import { PhotoService, InputData, PhotoSize } from '../services/photo.service';

@Pipe({
  name: 'profilePhoto'
})
export class ProfilePhotoPipe implements PipeTransform {
  constructor(private photoService: PhotoService) {}

  transform(source: InputData, size?: PhotoSize): string {
    /** This function returns the profile photo url from the source object
     * with the correct sizing, if specified, safely with a default.
     * Since this is a pipe, it defaults to pure and will save computation cycles.
     *
     * Example usage:
     *  employee | profilePhoto:'avatar'
     *  user | profilePhoto:'large'
     *  submittedBy | profilePhoto
     * */

    return this.photoService.getSizedUrl(source, size);
  }

}
