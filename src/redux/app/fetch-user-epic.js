import { of } from 'rxjs/observable/of';
import { ofType } from 'redux-observable';
import { types, fetchUserComplete } from './';
import { switchMap, filter, map, catchError, tap } from 'rxjs/operators';

function fetchUserEpic(action$, _, { services }) {
  return action$.pipe(
    ofType(types.fetchUser),
    tap(console.info),
    switchMap(() => {
      return services
        .readService$({ service: 'user' })
        .pipe(
          filter(({ entities, result }) => entities && !!result),
          tap(console.info),
          map(fetchUserComplete),
          catchError(() => of({ type: 'error' }))
        );
    })
  );
}

export default fetchUserEpic;
