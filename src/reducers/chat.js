import {
  ADD_MESSAGE,
} from '../constants/actionTypes';

const chatReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return state.concat([
        {
          message: action.message,
          author: action.author,
          id: action.id,
        },
      ]);
    default:
      return state;
  }
};

export default chatReducer;
