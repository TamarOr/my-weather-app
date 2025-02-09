import { Component, signal, inject, OnInit } from '@angular/core';
import { Location } from '../../../../shared/models/location.model';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, switchMap } from 'rxjs/operators';
import { LocationService } from 'src/app/core/services/location.service';
import { Subject, of } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private locationService = inject(LocationService);
  private messageService = inject(MessageService)
  private destroy$ = new Subject<void>();

  location = signal<Location>(null);

  ngOnInit(): void {

    this.activatedRoute.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const locationKey = params.get('locationKey');
        if (locationKey) {
          return this.locationService.getLocationByKey(locationKey);
        } else {
          return of(null);
        }
      })
    ).subscribe({
      next: location => {
        this.location.set(location);
      },
      error: err => {
        console.error('The requested location could not be found', err);
        this.showToast('The requested location could not be found. Please check the URL and try again.');
      }
    });
  }

  showToast(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

