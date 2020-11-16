import * as types from '../constants/actionTypes';

export const joinRoom = room => ({
  type: types.JOIN_ROOM,
  payload: { room },
});

export const updateMember = memberList => ({
  type: types.UPDATE_MEMBER,
  payload: { memberList },
});

export const leaveRoom = () => ({
  type: types.LEAVE_ROOM,
});
