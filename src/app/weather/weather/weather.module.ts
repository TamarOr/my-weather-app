import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchPage } from './pages/search/search.page';
import { WeatherCardComponent } from './pages/weather-card/weather-card.component';
import { LocationSearchComponent } from './pages/location-search/location-search.component';
import { WearRecommendationComponent } from './pages/wear-recommendation/wear-recommendation.component';
import { WeatherRoutingModule } from './weather-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    SearchPage,
    WeatherCardComponent,
    LocationSearchComponent,
    WearRecommendationComponent],
  imports: [
    ToastModule,
    CommonModule,
    WeatherRoutingModule,
    AutoCompleteModule,
    CardModule,
    FormsModule,
    ButtonModule],
    providers:[MessageService],
})
export class WeatherModule {}
