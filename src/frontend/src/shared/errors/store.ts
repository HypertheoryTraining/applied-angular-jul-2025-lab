import { signalStore, type } from '@ngrx/signals';
import { addEntity, withEntities } from '@ngrx/signals/entities';
import { eventGroup, on, withReducer } from '@ngrx/signals/events';

type ApplicationError = {
  id: string;
  message: string;
  source: string;
};

export const applicationErrorEvents = eventGroup({
  source: 'Application Errors',
  events: {
    addError: type<{ message: string; source: string }>(),
    removeError: type<{ id: string }>(),
    removeAllTheStinkingErrors: type<void>(),
  },
});

export const ErrorsStore = signalStore(
  withEntities<ApplicationError>(),
  withReducer(
    on(applicationErrorEvents.addError, ({ payload }) => {
      const id = crypto.randomUUID();
      const newError: ApplicationError = {
        id,

        source: payload.source,
        message: payload.message,
      };
      return addEntity(newError);
    }),
  ),
);
