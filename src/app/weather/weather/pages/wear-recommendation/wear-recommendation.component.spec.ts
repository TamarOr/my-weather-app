import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WearRecommendationComponent } from './wear-recommendation.component';

describe('WearRecommendationComponent', () => {
  let component: WearRecommendationComponent;
  let fixture: ComponentFixture<WearRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WearRecommendationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WearRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
