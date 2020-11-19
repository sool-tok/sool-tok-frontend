import {
  RENDER_ROOM,
  DESTROY_ROOM,
  ADD_MEMBER,
  DELETE_MEMBER,
  UPDATE_ROOM_LOCKING_STATUS,
} from '../constants/actionTypes';

const roomReducer = (state = null, action) => {
  switch (action.type) {
    case RENDER_ROOM:
      return action.payload.room;
    case ADD_MEMBER:
      return {
        ...state,
        memberList: [...state.memberList, action.payload.newMember],
      };
    case DELETE_MEMBER:
      return {
        ...state,
        memberList: state.memberList.filter(
          member => member.socketId !== action.payload.socketId,
        ),
      };
    case DESTROY_ROOM:
      return null;
    case UPDATE_ROOM_LOCKING_STATUS:
      return {
        ...state,
        isLocked: action.payload.isLocked,
      };
    default:
      return state;
  }
};

export default roomReducer;
