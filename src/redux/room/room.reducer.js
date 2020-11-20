import * as types from './room.actionTypes';

const roomReducer = (state = null, { type, payload }) => {
  switch (type) {
    case types.RENDER_ROOM:
      return payload.room;
    case types.ADD_MEMBER:
      return {
        ...state,
        memberList: [...state.memberList, payload.newMember],
      };
    case types.DELETE_MEMBER:
      return {
        ...state,
        memberList: state.memberList.filter(
          member => member.socketId !== payload.socketId,
        ),
      };
    case types.DESTROY_ROOM:
      return null;
    case types.UPDATE_ROOM_LOCKING_STATUS:
      return {
        ...state,
        isLocked: payload.isLocked,
      };
    default:
      return state;
  }
};

export default roomReducer;
