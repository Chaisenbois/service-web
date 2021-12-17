import {Component, OnInit} from '@angular/core';
import {Loan} from '../model/loan';
import {Observable} from 'rxjs';
import {LoanService} from '../services/loan.service';
import {UserService} from '../services/user.service';
import {BookService} from '../services/book.service';
import {User} from '../model/user';
import {Book} from '../model/book';
import {Copy} from '../model/copy';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  public loans$: Observable<Loan[]>;
  public users: User[];
  public books: Book[];

  constructor(public loanService: LoanService, public userService: UserService,
              public bookService: BookService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.loans$ = this.loanService.getAll();
    this.userService.getAll().subscribe((users) => {
      this.users = users;
    });
    this.bookService.getAll().subscribe((books) => {
      this.books = books;
    });
  }

  return(loanId: string) {
    this.loanService.return(loanId).subscribe(() => {
      this.init();
    });
  }

  getUserName(userId: string) {
    return this.users.find(u => u.id === userId)?.name ;
  }

  getBookName(copyId): string {
    return this.books.find((book) => book.copies.some(
        (c: Copy) => c.id === copyId )).name;
  }
}
