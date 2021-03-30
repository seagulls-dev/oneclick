import { Injectable } from '@angular/core';

import { AppUser } from '../auth/app-user.model';
import { Employee } from './employee.model';
import { SubmittedBy } from '../auth/submitted-by.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  getSizedUrl(data: InputData, size?: PhotoSize): string {
    // TODO: make this platform agnostic by storing different sized urls with different sizes on the object
    // TODO: right now, I'm using GroupMe's nomenclature directly. This is dangerous!
    // See: https://dev.groupme.com/docs/image_service

    // For now, it detects if the image is a GroupMe image, and then adjusts the url by appending the appropriate ending
    // otherwise, it just return the original url
    const originalUrl = this.getUrl(data);

    // We'll do this safely
    if(!size)
      return originalUrl;

    const isGroupMeUrl = originalUrl.indexOf('i.groupme.com') > -1;
    if(isGroupMeUrl)
      return originalUrl + "." + size;

    // I don't have different versions of images from other sources
    return originalUrl;
  }
  getUrl(data: InputData): string {
    const url = this.locateUrl(data);
    return url.replace("http://", "https://");
  }
  private locateUrl(data: InputData): string {
    if(data.submittedBy){
      const submittedBy = data.submittedBy;
      if(submittedBy.employee.profileUrl)
        return submittedBy.employee.profileUrl;

      if(submittedBy.user.profileUrl)
        return submittedBy.user.profileUrl;
    }

    if(data.employee && data.employee.profileUrl)
      return data.employee.profileUrl;

    if(data.user && data.user.profileUrl)
      return data.user.profileUrl;

    if(data.profileUrl)
      return data.profileUrl;

    return this.withDefault();
  }

  withDefault(url?: string): string {
    // will always return a photo url, even if it's a default one
    if(url && typeof url == 'string')
      return url;

    // gray chicken photo
    // TODO: reference from my own assets folder
    return 'https://i.pinimg.com/originals/9f/81/2d/9f812d4cf313e887ef99d8722229eee1.jpg';
  }

}

export type PhotoSize = "preview"|"large"|"avatar";
export interface InputData {
  employee?: Employee;
  user?: AppUser;
  submittedBy?: SubmittedBy;
  profileUrl?: string;
}
