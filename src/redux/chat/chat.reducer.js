import types from './chat.actionTypes';

const chatListReducer = (state = [], { type, payload }) => {
  switch (type) {
    case types.ADD_CHAT:
      return [...state, payload.chat];
    default:
      return state;
  }
};

export default chatListReducer;
