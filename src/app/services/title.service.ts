import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  constructor(private title: Title) { }

  set(pageName: string): void {
    this.title.setTitle(`One Click | ${pageName}`);
  }

  setManually(fullTitle: string): void {
    this.title.setTitle(fullTitle);
  }
}
