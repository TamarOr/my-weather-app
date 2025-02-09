import { Component, ChangeDetectionStrategy, effect, inject, model, OnDestroy, OnInit, signal } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { Location } from '../../../../shared/models/location.model';
import { CurrentWeather } from '../../../../shared/models/currentWeather.model';
import { Forecast } from '../../../../shared/models/forecast.model';
import { LoaderService } from '../../../../core/services/loader.service';
import { WeatherService } from '../../../../core/services/weather.service';

@Component({
    selector: 'app-weather-card',
    standalone: false,
    templateUrl: './weather-card.component.html',
    styleUrl: './weather-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherCardComponent implements OnInit, OnDestroy {
    private loaderService = inject(LoaderService);
    private weatherService = inject(WeatherService);
    private messageService = inject(MessageService)
    private destroy$ = new Subject<void>();

    location = model<Location>(null);
    selectedWeather = signal<CurrentWeather>(null);
    unit = signal<string>('°C');
    temp = signal<Number>(null);

    displayLoading = false;
    selectedForecast: Forecast;
    wantsClothing: boolean = false;

    constructor() {
        effect(() => {
            if (this.location() != null) {
                this.getWeatherAndForecast();
            }
        });
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
        this.wantsClothing = true;
        this.location.set(null);
    }

    getWeatherAndForecast() {
        this.loaderService.addRequest();

        forkJoin({
            currentWeather: this.weatherService.getCurrentWeather(this.location().Key),
            forecast: this.weatherService.getForecast(this.location().Key)
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ currentWeather, forecast }) => {
                    this.selectedWeather.set(currentWeather[0]);
                    this.selectedForecast = forecast;
                },
                error: (err) => {
                    console.error('Failed to fetch weather data', err);
                    this.showToast('Failed to fetch weather data. Please try again later.');
                    this.loaderService.removeRequest();
                },
                complete: () => {
                    this.loaderService.removeRequest();
                }
            });
    }

    updateUnit() {
        if (this.weatherService.isMetric) {
            this.unit.set('°C');
            this.temp.set(this.selectedWeather().Temperature.Metric.Value);
        } else {
            this.unit.set('°F');
            this.temp.set(this.selectedWeather().Temperature.Imperial.Value);
        }
    }

    showToast(message: string) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    }

    ngOnDestroy() {
        this.wantsClothing = false;
        this.destroy$.next();
        this.destroy$.complete();
    }

}
