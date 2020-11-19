import { combineReducers } from 'redux';

import userReducer from './user';
import roomReducer from './room';
import chatListReducer from './chatList';

export default combineReducers({
  user: userReducer,
  room: roomReducer,
  chatList: chatListReducer,
});
