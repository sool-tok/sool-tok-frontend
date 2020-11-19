import { ADD_CHAT } from '../constants/actionTypes';

const chatListReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_CHAT:
      return [...state, action.payload.chat];
    default:
      return state;
  }
};

export default chatListReducer;
