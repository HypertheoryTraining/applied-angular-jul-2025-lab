import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BooksStore } from './services/books-store';
import { TitleCasePipe } from '@angular/common';
import { BookSummary } from './components/book-summary';

@Component({
  selector: 'app-books',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BooksStore],
  imports: [TitleCasePipe, BookSummary],
  template: `
    <div>
      <app-book-summary></app-book-summary>
    </div>
    <h1 class="text-2xl font-bold">Books</h1>

    <div class="join">
      @for (sortKey of store.sortOptions; track sortKey) {
        <button
          [disabled]="store.sortKey() === sortKey"
          (click)="store.setSortKey(sortKey)"
          class="btn join-item"
        >
          {{ sortKey | titlecase }}
        </button>
      }
    </div>
    <div class="join pl-8">
      <button
        [disabled]="store.sortOrder() === 'asc'"
        (click)="store.setSortOrder('asc')"
        class="btn join-item"
      >
        Ascending Order
      </button>
      <button
        [disabled]="store.sortOrder() === 'desc'"
        (click)="store.setSortOrder('desc')"
        class="btn join-item"
      >
        Descending Order
      </button>
    </div>
    <div class="grid grid-flow-row grid-cols-5 gap-4 max-w-fit">
      @for (book of store.bookList(); track book.id) {
        <div class="card w-96 bg-base-100 shadow-xl p-4">
          <div class="card-body">
            <h2 class="card-title">{{ book.title }}</h2>
            <p>Author: {{ book.author }}</p>
            <p>Year: {{ book.year }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class Books {
  store = inject(BooksStore);
}
