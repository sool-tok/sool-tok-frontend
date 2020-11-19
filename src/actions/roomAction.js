import * as types from '../constants/actionTypes';

export const renderRoom = room => ({
  type: types.RENDER_ROOM,
  payload: { room },
});

export const destroyRoom = () => ({
  type: types.DESTROY_ROOM,
});

export const addMember = newMember => ({
  type: types.ADD_MEMBER,
  payload: { newMember },
});

export const deleteMember = socketId => ({
  type: types.DELETE_MEMBER,
  payload: { socketId },
});

export const updateRoomLockingStatus = isLocked => ({
  type: types.UPDATE_ROOM_LOCKING_STATUS,
  payload: { isLocked },
});
