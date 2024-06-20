import {
  ChangeDetectionStrategy,
  Component, computed, effect, ElementRef, inject, input,
  viewChild,
} from '@angular/core';
import {Store} from '@ngrx/store';
import {interval, combineLatest, switchMap, fromEvent} from 'rxjs';
import {Queue} from '~/business-logic/model/queues/queue';
import {queueActions} from '../../actions/queues.actions';
import {selectQueuesStatsTimeFrame, selectQueueStats, selectStatsErrorNotice} from '../../reducers/index.reducer';
import {TIME_INTERVALS} from '../../workers-and-queues.consts';
import {
  IOption
} from '@common/shared/ui-components/inputs/select-autocomplete-with-chips/select-autocomplete-with-chips.component';
import {formatDistance} from 'date-fns'
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'sm-queue-stats',
  templateUrl: './queue-stats.component.html',
  styleUrls: ['./queue-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueueStatsComponent {
  private readonly store = inject(Store);

  private selectedQueueId: string;
  public timeFrameOptions: IOption[] = [
    {label: '3 Hours', value: (3 * TIME_INTERVALS.HOUR).toString()},
    {label: '6 Hours', value: (6 * TIME_INTERVALS.HOUR).toString()},
    {label: '12 Hours', value: (12 * TIME_INTERVALS.HOUR).toString()},
    {label: '1 Day', value: (TIME_INTERVALS.DAY).toString()},
    {label: '1 Week', value: (TIME_INTERVALS.WEEK).toString()},
    {label: '1 Month', value: (TIME_INTERVALS.MONTH).toString()}];

  queue = input<Queue>();
  protected waitChartRef = viewChild<ElementRef<HTMLDivElement>>('waitchart');
  protected timeFrame = this.store.selectSignal(selectQueuesStatsTimeFrame);
  protected queueStats = this.store.selectSignal(selectQueueStats);
  protected refreshChart = computed(() => !(this.queueStats().wait || this.queueStats().length));
  protected statsError = this.store.selectSignal(selectStatsErrorNotice);

  timeFormatter = (value: number) => formatDistance(0, value * 1000, { includeSeconds: true });

  constructor() {
    effect(() => {
      this.store.dispatch(queueActions.getStats({maxPoints: this.waitChartRef().nativeElement.clientWidth | 1000}));
    }, {allowSignalWrites: true});

    effect(() => {
      if(this.queue()?.id !== this.selectedQueueId) {
        this.store.dispatch(queueActions.resetStats());
        this.store.dispatch(queueActions.getStats({maxPoints: this.waitChartRef().nativeElement.clientWidth | 1000}));
        this.selectedQueueId = this.queue()?.id;
      }
    }, {allowSignalWrites: true});

    combineLatest([
      toObservable(this.waitChartRef),
      this.store.select(selectQueuesStatsTimeFrame),
      fromEvent(window, 'resize')
    ])
      .pipe(
        takeUntilDestroyed(),
        debounceTime(0),
        map(([waitChartRef, timeFrame]) => {
          const range = parseInt(timeFrame, 10);
          let width = waitChartRef?.nativeElement.clientWidth ?? 1000;
          width = Math.min(0.8 * width, 1000);
          return Math.max(Math.floor(range / width), 5);
        }),
        switchMap(granularity => interval(granularity * 1000))
      )
      .subscribe(() => {
        this.store.dispatch(queueActions.getStats({maxPoints: this.waitChartRef().nativeElement.clientWidth | 1000}));
      })
  }

  timeFrameChanged(value: string) {
    this.store.dispatch(queueActions.setStatsParams({timeFrame: value, maxPoints: this.waitChartRef().nativeElement.clientWidth | 1000}));
  }
}
