import * as types from '../constants/actionTypes';

export const addChat = chat => ({
  type: types.ADD_CHAT,
  payload: { chat },
});
