import { Component, inject } from '@angular/core';
import { NavBar } from './components/nav-bar';
import { RouterOutlet } from '@angular/router';
import { CounterStore } from '../counter-lab/services/counter-store';
import { ErrorsStore } from '../shared/errors/store';

@Component({
  selector: 'app-root',
  template: `
    <app-nav-bar />

    <main class="container mx-auto pt-4">
      <router-outlet />
    </main>
    @if (errorStore.entities().length > 0) {
      @for (err of errorStore.entities(); track err.id) {
        <div class="toast">
          <div class="alert alert-info">
            <span>{{ err.message }} from {{ err.source }}</span>
          </div>
        </div>
      }
    }
  `,
  styles: [],
  imports: [NavBar, RouterOutlet],
})
export class App {
  store = inject(CounterStore);
  errorStore = inject(ErrorsStore);
}
