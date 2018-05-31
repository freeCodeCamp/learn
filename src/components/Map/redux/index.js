import { createAction, handleActions } from 'redux-actions';

import { createTypes } from '../../../../utils/stateManagment';

const ns = 'map';

export const getNS = () => ns;

const initialState = {
  expandedState: {
    superBlock: {},
    block: {}
  }
};

const types = createTypes(['toggleSuperBlock', 'toggleBlock'], ns);

export const toggleBlock = createAction(types.toggleBlock);
export const toggleSuperBlock = createAction(types.toggleSuperBlock);

// We want expanded by default, so we return the opposite of the expanded state
// This way we do not need to create a massive object full of zeros
// We only track the superBlock/blocks that the user has clicked
// If not clicked, it defaults to open
export const makeExpandedSuperBlockSelector = superBlock => state =>
  !state[ns].expandedState.superBlock[superBlock];
export const makeExpandedBlockSelector = block => state =>
  !state[ns].expandedState.block[block];

export const reducer = handleActions(
  {
    [types.toggleBlock]: (state, { payload }) => ({
      ...state,
      expandedState: {
        ...state.expandedState,
        block: {
          ...state.expandedState.block,
          [payload]: !state.expandedState.block[payload]
        }
      }
    }),
    [types.toggleSuperBlock]: (state, { payload }) => ({
      ...state,
      expandedState: {
        ...state.expandedState,
        superBlock: {
          ...state.expandedState.superBlock,
          [payload]: !state.expandedState.superBlock[payload]
        }
      }
    })
  },
  initialState
);
