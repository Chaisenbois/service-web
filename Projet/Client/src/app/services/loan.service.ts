import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseHttpService } from './baseHttpService';
import {Loan} from '../model/loan';

@Injectable()
export class LoanService extends BaseHttpService {
  loan(copyId, userId): Observable<void> {
    /* to be changed */
    return this.http.post(`${this.baseUrl}/loans`, {copyId, userId})
      .pipe(
        map(() => null),
        catchError((err) => { console.log(err); return null; })
      );
  }

  getAll() {
    return this.http.get<Loan[]>(`${this.baseUrl}/loans`);
  }

  return(loanId) {
    return this.http.delete(`${this.baseUrl}/loans/${loanId}`);
  }
}
