import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { _if } from 'rxjs/observable/if';
import { empty } from 'rxjs/observable/empty';
import { defer } from 'rxjs/observable/defer';
import {
  switchMap,
  tap,
  retry,
  map,
  catchError,
  startWith,
  ignoreElements
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { push } from 'react-router-redux';

import { _csrf as csrfToken } from '../../../redux/cookieVaules';

import {
  // backendFormValuesSelector,
  // frontendProjectFormValuesSelector,
  // backendProjectFormValuesSelector,
  // challengeMetaSelector,
  // moveToNextChallenge,
  submitComplete,
  // testsSelector,
  types,
  challengeMetaSelector,
  challengeTestsSelector
} from './';
import { userSelector } from '../../../redux/app';

import axios from 'axios';

const postJSON$ = (url, body) => fromPromise(axios.post(url, body));

const withState = (fn, state) => (...args) => fn(state, ...args);

function postChallenge(state, url, username, _csrf, challengeInfo) {
  const { nextChallengePath, introPath } = challengeMetaSelector(state);
  return _if(
    () => !!username,
    defer(() => {
      const body = { ...challengeInfo, _csrf };
      const saveChallenge = postJSON$(url, body).pipe(
        retry(3),
        map(({ points, completedDate }) =>
          submitComplete(username, points, {
            ...challengeInfo,
            completedDate
          })
        ),
        catchError(err => {
          console.error(err);
          return { type: 'here is an error' };
        })
      );
      const challengeCompleted = push(
        introPath ? introPath : nextChallengePath
      );
      return of(saveChallenge, challengeCompleted).pipe(
        tap(() => console.log('hello from tap')),
        startWith({
          type: 'starting????????'
        })
      );
    }),
    ignoreElements()
  );
}

function submitModern(type, state) {
  const tests = challengeTestsSelector(state);
  if (tests.length > 0 && tests.every(test => test.pass && !test.err)) {
    if (type === types.checkChallenge) {
      return empty();
    }

    if (type === types.submitChallenge) {
      const { id } = challengeMetaSelector(state);
      const { username } = userSelector(state);
      const postChallengeWithState = withState(postChallenge, state);
      return postChallengeWithState(
        '/services/modern-challenge-completed',
        username,
        csrfToken,
        {
          id
        }
      );
    }
  }
  return of({ type: 'Keep trying.' });
}

// function submitProject(type, state) {
//   if (type === types.checkChallenge) {
//     return Observable.empty();
//   }
//   const {
//     solution: frontEndSolution = '' } = frontendProjectFormValuesSelector(
//     state
//   );
//   const {
//     solution: backendSolution = '',
//     githubLink = ''
//   } = backendProjectFormValuesSelector(state);
//   const solution = frontEndSolution ? frontEndSolution : backendSolution;
//   const { id, challengeType } = challengeSelector(state);
//   const { username } = userSelector(state);
//   const csrfToken = csrfSelector(state);
//   const challengeInfo = { id, challengeType, solution };
//   if (challengeType === backEndProject) {
//     challengeInfo.githubLink = githubLink;
//   }
//   return Observable.merge(
//     postChallenge('/project-completed', username, csrfToken, challengeInfo),
//     Observable.of(closeChallengeModal())
//   );
// }

// function submitSimpleChallenge(type, state) {
//   const { id } = challengeSelector(state);
//   const { username } = userSelector(state);
//   const csrfToken = csrfSelector(state);
//   const challengeInfo = { id };
//   return postChallenge(
//     '/challenge-completed',
//     username,
//     csrfToken,
//     challengeInfo
//   );
// }

// function submitBackendChallenge(type, state) {
//   const tests = testsSelector(state);
//   if (
//     type === types.checkChallenge &&
//     tests.length > 0 &&
//     tests.every(test => test.pass && !test.err)
//   ) {
//     /*
//     return Observable.of(
//       makeToast({
//         message: `${randomCompliment()} Go to your next challenge.`,
//         action: 'Submit',
//         actionCreator: 'submitChallenge',
//         timeout: 10000
//       })
//     );
//     */
//     return Observable.empty();
//   }
//   if (type === types.submitChallenge.toString()) {
//     const { id } = challengeSelector(state);
//     const { username } = userSelector(state);
//     const csrfToken = csrfSelector(state);
//     const { solution } = backendFormValuesSelector(state);
//     const challengeInfo = { id, solution };
//     return postChallenge(
//       '/backend-challenge-completed',
//       username,
//       csrfToken,
//       challengeInfo
//     );
//   }
//   return Observable.of(makeToast({ message: 'Keep trying.' }));
// }

// const submitters = {
//   tests: submitModern
// backend: submitBackendChallenge,
// step: submitSimpleChallenge,
// video: submitSimpleChallenge,
// quiz: submitSimpleChallenge,
// 'project.frontEnd': submitProject,
// 'project.backEnd': submitProject,
// 'project.simple': submitSimpleChallenge
// };

export default function completionEpic(action$, { getState }) {
  return action$.pipe(
    tap(console.log),
    ofType(types.submitChallenge),
    switchMap(({ type }) => {
      // const { nextChallengePath, introPath } = challengeMetaSelector(
      //   getState()
      // );
      // const state = getState();
      // const { submitType } = challengeMetaSelector(state);
      // const submitter = submitters[submitType] || (() => empty());

      return submitModern(type, getState());
    }),
    tap((...args) => console.log(...args))
  );
}
