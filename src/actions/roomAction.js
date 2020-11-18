import * as types from '../constants/actionTypes';

export const joinRoom = room => ({
  type: types.JOIN_ROOM,
  payload: { room },
});

export const addMember = member => ({
  type: types.ADD_MEMBER,
  payload: { member },
});

export const deleteMember = memberId => ({
  type: types.DELETE_MEMBER,
  payload: { memberId },
});

export const leaveRoom = () => ({
  type: types.LEAVE_ROOM,
});
