import types from './chat.actionTypes';

export const addChat = chat => ({
  type: types.ADD_CHAT,
  payload: { chat },
});
