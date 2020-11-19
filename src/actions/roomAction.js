import * as types from '../constants/actionTypes';

export const renderRoom = room => ({
  type: types.RENDER_ROOM,
  payload: { room },
});

export const addMember = newMember => ({
  type: types.ADD_MEMBER,
  payload: { newMember },
});

export const deleteMember = socketId => ({
  type: types.DELETE_MEMBER,
  payload: { socketId },
});

export const deleteRoom = () => ({
  type: types.DELETE_ROOM,
});
