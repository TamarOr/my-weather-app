import { Component, ChangeDetectionStrategy, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { WearService } from 'src/app/core/services/wear.service';
import { WeatherService } from '../../../../core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { LoaderService } from '../../../../core/services/loader.service';
import { Wear } from 'src/app/shared/models/wear.model';

@Component({
  selector: 'app-wear-recommendation',
  standalone: false,
  templateUrl: './wear-recommendation.component.html',
  styleUrls: ['./wear-recommendation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WearRecommendationComponent implements OnInit, OnDestroy {
  private wearService = inject(WearService);
  private loaderService = inject(LoaderService);
  private weatherService = inject(WeatherService);
  private messageService = inject(MessageService)
  private destroy$ = new Subject<void>();

  currentWeather = input<CurrentWeather>(null);
  message = signal<string>("Hold on, I'm thinking about what would be the best outfit for you to wear today...");

  displayLoading = false;
  wear: Wear = {
    weatherText: '',
    temperature: 0,
    unit: '°C',
    hasPrecipitation: '',
    isDayTime: ''
  };
  recommendation: string = '';

  constructor() {
    effect(() => {
      this.wear.weatherText = this.currentWeather()?.WeatherText;
      this.wear.temperature = this.currentWeather()?.Temperature?.Metric?.Value;
      this.wear.hasPrecipitation = this.currentWeather()?.HasPrecipitation ? "rainy" : "not rainy";
      this.wear.isDayTime = this.currentWeather()?.IsDayTime ? "day" : "night";
      this.getRecommendation();
    })
  }

  ngOnInit() {
    this.loaderService.stateChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.displayLoading = loading;
      });

    this.weatherService.temperatureUnitChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateUnit();
      });
  }

  getRecommendation() {
    this.loaderService.addRequest();
    this.wearService.getClothingRecommendation(this.wear)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          let responseText = response[0]?.generated_text || '';
          const indexOfQuestionMark = responseText.indexOf('?');
          this.recommendation = indexOfQuestionMark !== -1 ? responseText.slice(indexOfQuestionMark + 1).trim() : responseText.trim();
        },
        error: (error) => {
          console.log('There was an error fetching the recommendation', error)
          this.showToast('There was an error fetching the recommendation');
          this.loaderService.removeRequest();
        },
        complete: () => {
          this.loaderService.removeRequest();
          this.message.set('Here’s my recommendation for what to wear today...');
        }
      });
  }

  updateUnit() {
    if (this.weatherService.isMetric) {
      this.wear.unit = '°C';
      this.wear.temperature = this.currentWeather()?.Temperature.Metric.Value;
    } else {
      this.wear.unit = '°F';
      this.wear.temperature = this.currentWeather()?.Temperature.Imperial.Value;
    }
  }

  showToast(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
