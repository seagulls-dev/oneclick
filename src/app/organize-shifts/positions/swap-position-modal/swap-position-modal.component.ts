import { Component, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { AuthService } from 'src/app/auth/auth.service';
import { BonusPosition, BonusPositionInput } from 'src/app/services/destination.model';
import { ConfigService } from 'src/app/config/config.service';
import { PositionId } from 'src/app/config/layout-generation-config.model';
import { PositionDefinition } from 'src/app/config/client-config.model';
import { Layout } from '../../layout.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-swap-position-modal',
  templateUrl: './swap-position-modal.component.html',
  styleUrls: ['./swap-position-modal.component.scss']
})
export class SwapPositionModalComponent {
  @Output() newPosition = new EventEmitter<BonusPosition>();

  newPositionName = '';
  positionRequirement: PositionId = ''; // Begins with '@'
  trainingPositions: PositionDefinition[];

  positions: BonusPosition[];

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private cd: ChangeDetectorRef
  ) { }

  // Called by the modal box when it is created
  prepare(): void {
    // Since oc-modal removes it's content when it's hidden,
    // this will be called every time the modal opens

    const destination = this.authService.getDestination();
    if(!destination)
      return; // We can't build without a destination. We need to retry after it loads

    // Put the most recently used positions on top
    let positions: BonusPosition[] = destination.bonusPositions ? Object.values(destination.bonusPositions) : [];
    this.positions = positions.sort((a, b) => +b.lastUsed - +a.lastUsed);

    // Import the positions
    this.trainingPositions = this.configService.getConfig<PositionDefinition[]>("client.progression", []);

    this.cd.markForCheck();
  }

  selectPosition(position: BonusPosition): void {
    this.newPosition.emit(position);
  }
  createBonusPosition(): void {
    const destination = this.authService.getDestination();
    if(!destination)
      throw Error("Cannot create a bonus position without a destination");

    if(!this.newPositionName){
      alert("Cannot create a new BonusPosition without a title.");
      return;
    }

    if(!this.positionRequirement){
      alert("Cannot create a new BonusPosiion without a training requirement");
      return;
    }

    const newPosition: BonusPositionInput = {
      title: this.newPositionName,
      id: Layout.getBaseId(this.newPositionName),
      requireTraining: this.positionRequirement,
    }

    // This relies on the destination locally saving
    // TODO: display a loading spinner while this occurs
    destination.createBonusPosition(newPosition)
      .then(() => {
        const constructedPosition = destination.bonusPositions[newPosition.id];
        this.selectPosition(constructedPosition);
      });
  }

  // TODO: Provide an option to call this from the modal!
  deleteBonusPosition(position: BonusPosition): void {
    const destination = this.authService.getDestination();
    if(!destination)
      throw Error("Cannot delete a bonus position without a destination");

    destination.deleteBonusPosition(position)
    .then(() => this.prepare());
  }
}
