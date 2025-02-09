import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../core/services/loader.service';
import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../shared/models/location.model';
import { FavoritesService } from 'src/app/core/services/favorites.service';

@Component({
  selector: 'app-location-search',
  standalone: false,
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSearchComponent implements OnInit {
  private loaderService = inject(LoaderService);
  private locationService = inject(LocationService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  private messageService = inject(MessageService)
  private destroy$ = new Subject<void>();
  private latestRequestId = 0;

  displayLoading = false;
  value: string = '';
  items: Location[] = [];
  selectedLocationKey: string;
  favorites: Location[] = [];
  isFavoritesLoaded: boolean = false;

  ngOnInit(): void {
    this.loaderService.stateChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.displayLoading = loading;
      });
  }

  searchLocation(event: any) {
    const searchText = event.query.trim();
    if (!searchText) return;

    if (!this.isFavoritesLoaded) {
      this.favorites = this.favoritesService.getFavorites();
      this.isFavoritesLoaded = true;
    }

    this.loaderService.addRequest();
    const requestId = ++this.latestRequestId;

    this.locationService.getAutocompleteLocation(searchText).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (locations) => {
        if (requestId === this.latestRequestId) {
          this.items = locations;
        }
      },
      error: (err) => {
        console.error('Unable to load locations', err);
        this.showToast('Unable to load locations. Please try again later');
        this.loaderService.removeRequest();
      },
      complete: () => {
        this.loaderService.removeRequest();
      }
    });
  }

  onSelect(location: any) {
    this.router.navigate(['/search', location.value.Key]);
    this.value = '';
  }

  onKeyDown(event: KeyboardEvent) {
    const regex = /^[a-zA-Z\s\-]$/;
    const key = event.key;

    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  toggleFavorite(location: Location, event: MouseEvent): void {
    event.stopPropagation();
    if (this.isFavorite(location)) {
      this.favoritesService.removeFromFavorites(location.Key);
    } else {
      this.favoritesService.addToFavorites(location);
    }
  }

  isFavorite(location: Location): boolean {
    return this.favoritesService.isFavorite(location);
  }

  showToast(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

}
