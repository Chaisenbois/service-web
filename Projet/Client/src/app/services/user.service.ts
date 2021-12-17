import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';

import { User } from '../model/user';
import { BaseHttpService } from './baseHttpService';
import {Book} from '../model/book';

@Injectable()
export class UserService extends BaseHttpService {
  public getAll(): Observable<User[]> {
    return this.http
        .get<User[]>(`${this.baseUrl}/users`);
  }

  public get(userId) {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
  }
}
