import {
  JOIN_ROOM,
  LEAVE_ROOM,
  ADD_MEMBER,
  DELETE_MEMBER,
  UPDATE_ROOM_LOCKING_STATUS,
} from '../constants/actionTypes';

const roomReducer = (state = null, action) => {
  switch (action.type) {
    case JOIN_ROOM:
      return action.payload.room;
    case ADD_MEMBER:
      return {
        ...state,
        memberList: [...state.memberList, action.payload.member],
      };
    case DELETE_MEMBER:
      return {
        ...state,
        memberList: state.memberList.filter(
          member => member.id !== action.payload.memberId,
        ),
      };
    case LEAVE_ROOM:
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
