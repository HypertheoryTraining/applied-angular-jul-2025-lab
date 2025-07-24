import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ApiLinkCreate } from '../services/links-api';
import { LinksStore } from '../services/links-store';
@Component({
  selector: 'app-links-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: ` <form
    [formGroup]="form"
    class="flex flex-col gap-4"
    (ngSubmit)="submit()"
  >
    <label class="label"
      >Link
      <input formControlName="url" type="text" class="input input-bordered" />
    </label>
    <label class="label"
      >Label
      <input formControlName="title" type="text" class="input input-bordered" />
    </label>
    <label for="tags">Tags</label>
    <div formArrayName="tags">
      @for (tag of form.controls.tags.controls; track tag; let i = $index) {
        <div>
          <input
            [formControlName]="i"
            type="text"
            class="input input-bordered"
            placeholder="Comma-separated tags"
            list="existing-tags"
          />
          <button
            type="button"
            class="btn btn-xs btn-circle btn-error"
            (click)="removeTag(i)"
          >
            -
          </button>
          <button
            type="button"
            class="btn btn-xs btn-circle btn-primary"
            (click)="addTag()"
          >
            +
          </button>
        </div>
      }
    </div>

    <datalist id="existing-tags">
      @for (tag of availableTags(); track tag) {
        <option [value]="tag">{{ tag }}</option>
      }
    </datalist>
    <button type="submit" class="btn btn-primary">Add Link</button>
  </form>`,
  styles: ``,
})
export class Add {
  store = inject(LinksStore);
  existingTags = this.store.tags;
  usedTags = signal(new Set<string>());

  availableTags = computed(() => {
    const existingTags = Array.from(this.existingTags());
    const usedTags = Array.from(this.usedTags().values());
    return existingTags.filter(
      (tag) => !usedTags.includes(tag) && tag.trim() !== '',
    );
  });
  form = new FormGroup({
    url: new FormControl('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true }),
    tags: new FormArray([new FormControl('', { nonNullable: true })]),
  });

  addTag() {
    this.form.controls.tags.push(new FormControl('', { nonNullable: true }));
  }
  removeTag(index: number) {
    const tags = this.form.controls.tags;

    tags.removeAt(index);
  }

  constructor() {
    this.form.controls.tags.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe((tags) => {
        this.usedTags.set(new Set(tags.filter((tag) => tag.trim() !== '')));
        this.form.controls.tags.setValue(
          tags.map((tag) => this.#normalizeTag(tag)),
          { emitEvent: false },
        );
      });
  }

  submit() {
    const link = this.form.value as ApiLinkCreate;
    this.store.addLink(link);
    this.form.reset();
  }
  #normalizeTag(tag: string): string {
    const result = tag

      .toLowerCase()
      .replace(/ +/g, '-')
      .substring(0, 20)
      .trim();
    return result;
  }
}
