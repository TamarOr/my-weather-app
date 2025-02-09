import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPage } from './weather/weather/pages/search/search.page';
import { LocationSearchComponent } from './weather/weather/pages/location-search/location-search.component';
import { WearRecommendationComponent } from './weather/weather/pages/wear-recommendation/wear-recommendation.component';
import { locationGuard } from './core/guards/location.guard';


const routes: Routes = [
  {
    path: 'search',
    component: LocationSearchComponent,
    canActivate: [locationGuard],
  },
  {
    path: 'search/:locationKey',
    component: SearchPage,
  },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
