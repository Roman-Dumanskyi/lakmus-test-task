import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { mockData } from './data';

export interface ICondition {
  id: number;
  chapterNumber: any;
  chapterName: string;
  blockNumber: string;
  blockName: string;
  code: string;
  name: string;
  shortName: string;
  isPublic: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConditionService {
  constructor(private http: HttpClient) {}

  search(text: string): Observable<ICondition[]> {
    if (!text) {
      return of(mockData);
    } else {
      return of(mockData.filter((el) => el.name.includes(text)));
    }
    /* return this.http.get<ICondition[]>(
      `https://global.lakmus.org/Dictionaries/icpc2?IsPublic=true&Search=${text}`
      }
    ); */
  }
}
