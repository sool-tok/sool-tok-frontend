import * as types from '../constants/actionTypes';

export const addMessage = (message, author, id) => ({
  type: types.ADD_MESSAGE,
  id,
  message,
  author,
});
