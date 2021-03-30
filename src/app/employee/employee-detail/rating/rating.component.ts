import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { ConfigService } from 'src/app/config/config.service';
import { Employee } from 'src/app/services/employee.model';
import { Omit } from 'src/app/helpers/omit';

import { HintData } from 'src/app/organize-shifts/prompt-ratings/prompt-ratings.component';
import { PositionDefinition } from 'src/app/config/client-config.model';
import { RatingCriteria, Benchmark } from 'src/app/config/training-config.model';
import { RatingEventData2, ScoreCache, HistoryEvent, RatingEvent2 } from 'src/app/services/employee-ratings.model';

import { ChickenPuns } from './chicken-puns';
import { randomElement, round } from 'src/app/helpers/snippet';
import { oneMinute } from 'src/app/organize-shifts/time.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnChanges {
  @Input() employee: Employee;
  @Input() position: PositionDefinition;
  @Input() hint?: HintData;
  @Output() finished = new EventEmitter<void>();

  placeholder: string;
  message: string;
  scores: Scores;
  noScores: boolean = false;
  submitTouched: boolean;

  // Assume that the trainer beings the rating, works on it consistently
  // and finishes without any interruptions
  // TODO: implement a more robust system that detects inactivity to 'pause' the timer
  private composingBeganAt: Date;
  private hintPreview?: RatingPreview;
  private ratingChanges?: number;

  private stop$ = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private configService: ConfigService
  ) {
    this.resetForm();
  }

  ngOnInit() {
    // Recheck when
    this.configService.documentLoaded$
    .pipe(takeUntil(this.stop$))
    .subscribe(_type => this.cd.markForCheck());
  }
  ngOnChanges(changes: SimpleChanges) {
    // When the position changes, reset the form
    if(changes.position)
      this.resetForm();
  }
  ngOnDestroy() {
    this.stop$.emit();
  }

  getCriteria(criteriaId: string): RatingCriteria|EmptyRatingCriteria {
    return this.configService.getConfig<RatingCriteria>(`training.ratingCriteria.${criteriaId}`, {});
  }
  getMeaning(benchmarks: Benchmark[], score?: number): string {
    if(!benchmarks)
      return 'No benchmarks';

    if(!score || score < 1)
      return 'No score';

    let benchmark = benchmarks
    .sort((a, b) => b.minScore - a.minScore)
    .find(a => a.minScore <= score);

    if(benchmark)
      return benchmark.meaning;

    return "";
    // Don't throw here because then the app
    // could crash if the underlying data changes improperly
    // throw Error(`Could not match score ${score} to the list of benchmarks`);
  }
  getAverageScore(position: PositionDefinition, scores: Scores): number {
    if(!position.criterion || !scores) return 0;

    var total = 0, count = 0;
    for(let criteriaId of position.criterion)
      total += scores[criteriaId] || 0, count++;

    return Math.floor(total / count * 10) / 10;
  }

  private resetForm(): void {
    this.scores = {};
    this.message = "";

    this.submitTouched = false;
    this.composingBeganAt = new Date;
    this.hintPreview = undefined;

    // Instead of defaulting with 3 stars, start with zero
    // This will force the trainers to pick values and hopefully
    // increase the accuracy of the ratings and improve adherence to the definitions
    if(this.position && this.position.criterion)
      for(let criteriaKey of this.position.criterion)
        this.scores[criteriaKey] = 0;

    // Pick a random funny chicken pun
    this.placeholder = randomElement(ChickenPuns);
  }

  private buildRating(): RatingEventData2 {
    // Just build the object

    const business = this.authService.getBusiness();
    const destination = this.authService.getDestination();
    const user = this.authService.getUser();
    const employee = this.authService.getEmployee();

    if(!business || !destination || !user || !employee)
      throw Error(`Cannot build rating without all of business, destination, user, and employee`);

    const position = this.position;
    const minutesComposing = round((+(new Date) - +this.composingBeganAt) / oneMinute, 1);
    let rating: RatingEventData2 = {
      // `position` is ommited because it's possible to write without regard to a specific position
      // Nevertheless, we will always capture the destination so we can help provide sort/filter ratings...
      ...this.authService.generateBasicIdData(),

      composedInMinutes: minutesComposing,

      messageMarkdown: (this.message || "").replace(/\n/g, "\\n"), // preserve the line breaks
    };

    if(position.id !== "general"){
      if(!position.criterion || !position.criterion.length)
        throw Error(`Cannot submit a rating on a position with criterion: ${position.title}`);

      rating.position = { id: position.id, name: position.title || "No position" };
      // Only include the position if it's passed in. It is possible to write comments generally without a position

      let totalScore = 0, numScores = 0,
          scoreList: ScoreCache[] = [];
      for(let criteriaId of position.criterion){
        totalScore += this.scores[criteriaId], numScores++;

        let criteria = this.configService.getConfig<RatingCriteria>(`training.ratingCriteria.${criteriaId}`, false);
        if(!criteria)
          throw Error(`[RatingComponent.submitRating]: Could not find criteriaId ${criteriaId}. The data may not have loaded yet.`);

        scoreList.push({
          criteriaId,
          name: criteria.title,
          value: this.scores[criteriaId] || 0,
          meaning: this.getMeaning(criteria.benchmarks, this.scores[criteriaId]),
        });
      }

      // compute the average score and conditionally add the score info to the event
      const avgScore = numScores > 0 ? round(totalScore / numScores, 1) : 0;
      if(avgScore >= 1 && !this.noScores) {
        rating.score = avgScore;
        rating.scores = scoreList;
      }
    }

    if(this.hint)
      rating.hint = this.hint;

    return rating;
  }
  submitRating(_method: string): Promise<void> {
    // TODO: measure telemetrics with the method (how did they call this function)
    this.submitTouched = true;
    if(this.submitIsDisabled())
      return;

    this.authService.guestActivity("rating-component: submit rating");

    const rating = this.buildRating();

    return Promise.all([
      this.employee.postRating(rating), // The person being rated
      this.authService.getEmployee().countRating(rating) // The person doing the rating
    ])
      .then(() => {
        this.resetForm();
        this.finished.emit();
      })
      .catch(error => {
        console.warn(error);
        alert(`Error posting rating. Check the console or tell a developer.`);
      });
  }
  getPreviewRating(): RatingPreview|undefined {
    // If we haven't already built the preview OR if the score changed, build it
    // If we couldn't build the rating, return undefined to try again later

    if(!this.hintPreview || this.hintPreview.score !== this.getAverageScore(this.position, this.scores)) {
      try {
        // I want to save the timestamp of the initial generation while they are editing it
        const oldTime = this.hintPreview ? this.hintPreview.time : false;

        this.hintPreview = {
          kind: 'rating2',
          time: new Date,

          ...this.buildRating()
        }

        if(oldTime)
          this.hintPreview.time = oldTime;
      }catch(e) {
        return undefined; // The rating couldn't be built
      }
    }

    // Since we are using OnPush change detection, I can rely on this to fire
    // on changes like keystrokes and similar events in this component
    // Send a guestActivity event every X keystrokes to keep the guest logged in
    const BUFFER_BY_KEYSTROKES = 5;
    this.ratingChanges = (this.ratingChanges || 0) + 1;
    if(this.ratingChanges > BUFFER_BY_KEYSTROKES){
      this.authService.guestActivity("rating-component:editing rating");
      this.ratingChanges = 0;
    }

    // Then save in the message
    // I have to change the object reference so that that the change detection will catch it
    this.hintPreview.messageMarkdown = this.message;
    return { ...this.hintPreview };
  }

  submitIsDisabled(): boolean {
    if(this.noScores || !this.position || !this.position.criterion)
      return false;

    for(let criteriaKey of this.position.criterion)
      // matches: 0, undefined, "", etc...
      // wont match: 1, 2, 3, 4, 5 (any real rating value)
      if(!this.scores[criteriaKey])
        return true;

    return false;
  }
}

interface EmptyRatingCriteria {}
interface Scores { [criteriaId: string]: number }

type RatingPreview = Omit<HistoryEvent<RatingEvent2>, "ref"|"id">;
