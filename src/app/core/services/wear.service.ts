// services/wear.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Wear } from 'src/app/shared/models/wear.model';

@Injectable({
  providedIn: 'root',
})
export class WearService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct';
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${environment.apiKeyHuggingface}`,
    'Content-Type': 'application/json'
  });

  getClothingRecommendation(wear: Wear): Observable<any> {
    const prompt = ` Please provide detailed suggestions for suitable attire considering the current weather and time of day. Today, the weather is ${wear.weatherText}, with a temperature of ${wear.temperature}${wear.unit}. The conditions are ${wear.hasPrecipitation}, and it is currently ${wear.isDayTime}. Based on this information, what type of clothes would you recommend I wear today?`;
    return this.http.post(this.apiUrl, { inputs: prompt }, { headers: this.headers });
  }

}
