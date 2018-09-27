import { merge } from 'rxjs/observable/merge';
import { empty } from 'rxjs/observable/empty';
import {
  tap,
  filter,
  map,
  ignoreElements,
  switchMap,
  catchError
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import store from 'store';
import uuid from 'uuid/v4';

import { types, onlineStatusChange, isOnlineSelector } from './';
import postUpdate$ from '../../templates/Challenges/utils/postUpdate$';
import { isGoodXHRStatus } from '../../templates/Challenges/utils';

const key = 'fcc-failed-updates';

function delay(time = 0, fn) {
  return setTimeout(fn, time);
}

function failedUpdateEpic(action$, { getState }) {
  const storeUpdates = action$.pipe(
    ofType(types.updateFailed),
    tap(({ payload = {} }) => {
      if ('endpoint' in payload && 'payload' in payload) {
        const failures = store.get(key) || [];
        payload.id = uuid();
        store.set(key, [...failures, payload]);
      }
    }),
    map(() => onlineStatusChange(false))
  );

  const flushUpdates = action$.pipe(
    ofType(types.fetchUserComplete, types.updateComplete),
    filter(() => store.get(key)),
    filter(() => isOnlineSelector(getState())),
    tap(() => {
      const failures = store.get(key) || [];
      let delayTime = 100;
      const batch = failures.map((update, i) => {
        // we stagger the updates here so we don't hammer the server
        // *********************************************************
        // progressivly increase additional delay by the amount of updates
        // 1st: 100ms delay
        // 2nd: 200ms delay
        // 3rd: 400ms delay
        // 4th: 700ms delay
        // 5th: 1100ms delay
        // 6th: 1600ms delay
        // and so-on
        delayTime += 100 * i;
        return delay(delayTime, () =>
          postUpdate$(update)
            .pipe(
              switchMap(response => {
                if (
                  response &&
                  (response.message || isGoodXHRStatus(response.status))
                ) {
                  console.info(`${update.id} succeeded`);
                  // the request completed successfully
                  const failures = store.get(key) || [];
                  const newFailures = failures.filter(x => x.id !== update.id);
                  store.set(key, newFailures);
                }
                return empty();
              }),
              catchError(() => empty())
            )
            .toPromise()
        );
      });
      Promise.all(batch)
        .then(() => console.info('progress updates processed where possible'))
        .catch(err =>
          console.warn('unable to process progress updates', err.message)
        );
    }),
    ignoreElements()
  );

  return merge(storeUpdates, flushUpdates);
}

export default failedUpdateEpic;
