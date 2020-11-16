import { combineReducers } from 'redux';

import userReducer from './user';
import roomReducer from './room';
import socketReducer from './socket';
import chatReducer from './chat';

export default combineReducers({
  user: userReducer,
  socket: socketReducer,
  room: roomReducer,
  chat: chatReducer,
});
