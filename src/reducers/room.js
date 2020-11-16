import { JOIN_ROOM, LEAVE_ROOM, UPDATE_MEMBER } from '../constants/actionTypes';

const roomReducer = (state = null, action) => {
  switch (action.type) {
    case JOIN_ROOM:
      return action.payload.room;
    case UPDATE_MEMBER:
      return {
        ...state,
        memberList: action.payload.memberList,
      };
    case LEAVE_ROOM:
      return null;
    default:
      return state;
  }
};

export default roomReducer;
