import {
  RENDER_ROOM,
  DELETE_ROOM,
  ADD_MEMBER,
  DELETE_MEMBER,
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
    case DELETE_ROOM:
      return null;
    default:
      return state;
  }
};

export default roomReducer;
