import {
  USER_SELECTION_ADD,
  USER_SELECTION_REMOVE,
  USER_SELECTION_CLEAR,
} from './types';

export const usersAddSelection = userId => (
  (dispatch) => {
    dispatch({ type: USER_SELECTION_ADD, payload: userId });
  }
);

export const usersRemoveSelection = userId => (
  (dispatch) => {
    dispatch({ type: USER_SELECTION_REMOVE, payload: userId });
  }
);

export const usersClearSelection = () => (
  { type: USER_SELECTION_CLEAR }
);
