import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { BooksStore } from '../services/books-store';

@Component({
  selector: 'app-book-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    @let summary = store.getBookSummary();
    <div class="card bg-base-200 shadow-xl p-6">
      <h2 class="card-title text-xl mb-4">📚 Book Collection Summary</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="stat">
          <div class="stat-title">Total Books</div>
          <div class="stat-value text-primary">{{ summary.totalBooks }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Average Pages</div>
          <div class="stat-value text-secondary">
            {{ summary.averagePages }}
          </div>
        </div>
        <div class="stat">
          <div class="stat-title">Earliest Year</div>
          <div class="stat-value text-accent">{{ summary.earliestYear }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Most Recent Year</div>
          <div class="stat-value text-info">{{ summary.latestYear }}</div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class BookSummary {
  store = inject(BooksStore);
}
