import { createAction, handleActions } from 'redux-actions';

import { createTypes } from '../../../utils/stateManagment';
import fecthUserEpic from './fetch-user-epic';

const ns = 'app';

function userIdentReplacer(state) {
  return {
    ...state,
    [ns]: {
      ...state[ns],
      user: {
        ...state[ns].user,
        about: '**blank**',
        email: '**blank**',
        facebook: '**blank**',
        githubProfile: '**blank**',
        linkedin: '**blank**',
        location: '**blank**',
        name: '**blank**',
        picture: '**blank**',
        portfolio: '**blank**',
        twitter: '**blank**',
        username: '**blank**',
        website: '**blank**'
      }
    }
  };
}

export const epics = [fecthUserEpic];

export const types = createTypes(
  [
    'fetchUser',
    'fetchUserComplete',
    'fetchUserError',
    'updateUserSignedIn',
    'toggleMapModal'
  ],
  ns
);

const initialState = {
  appUsername: '',
  isSignedIn: false,
  user: {},
  showMapModal: false
};

export const fetchUser = createAction(types.fetchUser);
export const fetchUserComplete = createAction(types.fetchUserComplete);
export const fecthUserError = createAction(types.fetchUserError);

export const toggleMapModal = createAction(types.toggleMapModal);

export const updateUserSignedIn = createAction(types.updateUserSignedIn);

export const isMapModalOpenSelector = state => state[ns].showMapModal;
export const isSignedInSelector = state => state[ns].isSignedIn;
export const userSelector = state => state[ns].user || {};
export const completedChallengesSelector = state =>
  state[ns].user.completedChallenges || [];

export const allAppDataSelector = state => userIdentReplacer(state);

export const reducer = handleActions(
  {
    [types.fetchUserComplete]: (
      state,
      { payload: { entities: { user }, result } }
    ) => ({
      ...state,
      appUsername: result,
      user: user[result],
      isSignedIn: !!Object.keys(user).length
    }),
    [types.toggleMapModal]: state => ({
      ...state,
      showMapModal: !state.showMapModal
    }),
    [types.updateUserSignedIn]: (state, { payload }) => ({
      ...state,
      isSignedIn: payload
    })
  },
  initialState
);
