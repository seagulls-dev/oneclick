// Based on an answer on StackOverflow
// https://stackoverflow.com/a/52735465/2844859
import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[ocBackButton]'
})
export class BackButtonDirective {
  constructor(private _location: Location) { }

  @HostListener('click')
  onClick() { this._location.back() }
}
