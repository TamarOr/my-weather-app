import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';
import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const locationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const locationService = inject(LocationService);
  const defaultCity = 'Tel Aviv'
  const locationKey = route.paramMap.get('locationKey');

  if (!locationKey) {
    return locationService.getAutocompleteLocation(defaultCity).pipe(
      switchMap(locations => {
        if (locations.length === 1) {
          const locationKey = locations[0].Key;
          router.navigate([`/search/${locationKey}`]);
          return of(false);
        } else {
          return of(true);
        }
      })
    );
  } else {
    return of(true);
  }

};
