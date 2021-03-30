import { Component, OnInit, ElementRef, Attribute } from '@angular/core';

/** USAGE:
 * <oc-profile-photo size?="200px">
 *    <img src="" alt="" .../>
 * </oc-profile-photo>
 *
 * */

@Component({
  selector: 'oc-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent implements OnInit {
  constructor(
    private el: ElementRef,
    @Attribute('size') private size?: string,
  ) { }

  ngOnInit() {
    if(this.size) {
      this.el.nativeElement.style.height = this.size;
      this.el.nativeElement.style.width = this.size;
    }
  }
}
