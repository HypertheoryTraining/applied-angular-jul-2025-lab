import { computed, resource } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { BookApiItem } from '../types';
export type BookSummary = {
  totalBooks: number;
  earliestYear: number;
  latestYear: number;
  averagePages: number;
};

const SORT_OPTIONS = ['title', 'author', 'year'] as const;
type SortKey = (typeof SORT_OPTIONS)[number];
export const BooksStore = signalStore(
  withState({
    sortKey: 'title' as SortKey,
    sortOrder: 'asc' as 'asc' | 'desc',
  }),
  withProps(() => {
    return {
      sortOptions: SORT_OPTIONS,
      _booksResource: resource<BookApiItem[], unknown>({
        loader: () => fetch('/api/books').then((r) => r.json()),
      }),
    };
  }),
  withMethods((store) => {
    return {
      setSortKey: (key: SortKey) => patchState(store, { sortKey: key }),
      setSortOrder: (order: 'asc' | 'desc') =>
        patchState(store, { sortOrder: order }),
      toggleSortOrder: () =>
        patchState(store, {
          sortOrder: store.sortOrder() === 'asc' ? 'desc' : 'asc',
        }),
    };
  }),
  withComputed((store) => {
    return {
      getBookSummary: computed(() => {
        const books = store._booksResource.value();
        if (!books || books.length === 0) {
          return {
            totalBooks: 0,
            earliestYear: 0,
            latestYear: 0,
            averagePages: 0,
          };
        }
        const totalBooks = books.length;
        const earliestYear = Math.min(...books.map((b) => b.year));
        const latestYear = Math.max(...books.map((b) => b.year));
        const averagePages =
          books.reduce((sum, b) => sum + (b.pages || 0), 0) / totalBooks;

        return {
          totalBooks,
          earliestYear,
          latestYear,
          averagePages,
        };
      }),
      bookList: computed(() => {
        const books = store._booksResource.value();
        const sortKey = store.sortKey();
        const sortOrder = store.sortOrder();
        if (!books) return [];
        return books.sort((a, b) => {
          let comparison = 0;
          if (sortKey === 'title' || sortKey === 'author') {
            comparison = a[sortKey]
              .toString()
              .localeCompare(b[sortKey].toString());
          } else if (sortKey === 'year') {
            comparison = a.year - b.year;
          }

          return sortOrder === 'desc' ? -comparison : comparison;
        });
      }),
    };
  }),
);
