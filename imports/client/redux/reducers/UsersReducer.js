import {
  USER_SELECTION_ADD,
  USER_SELECTION_REMOVE,
  USER_SELECTION_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
  selectedUsers: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_SELECTION_ADD:
      if (state.selectedUsers.indexOf(action.payload) > -1) {
        console.log(action.payload, 'ID already exists in users array, not adding');
        return { ...state };
      }

      return { ...state, selectedUsers: [...state.selectedUsers, action.payload] };

    case USER_SELECTION_REMOVE:
      if (state.selectedUsers.indexOf(action.payload) > -1) {
        return {
          ...state,
          selectedUsers: state.selectedUsers.filter(item => item !== action.payload),
        };
      }

      console.log(action.payload, 'ID not found, not deleting');
      return { ...state };

    case USER_SELECTION_CLEAR:
      return INITIAL_STATE;

    default:
      return state;
  }
};
