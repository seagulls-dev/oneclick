import { Component, OnInit } from '@angular/core';

import { TitleService } from '../services/title.service';

@Component({
  selector: 'oc-no-permission',
  templateUrl: './no-permission.component.html',
  styleUrls: ['./no-permission.component.scss']
})
export class NoPermissionComponent implements OnInit {

  constructor(private titleService: TitleService) { }

  ngOnInit() {
    this.titleService.set("Permission Denied");
  }

}
