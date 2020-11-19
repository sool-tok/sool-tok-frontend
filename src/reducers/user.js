import * as types from '../constants/actionTypes';

const userReducer = (state = null, action) => {
  switch (action.type) {
    case types.LOGIN_USER:
      return { ...action.payload.user };
    case types.ADD_FRIEND_LIST:
      return { ...state, friendList: [...action.payload.friendList] };
    case types.ADD_FRIEND_REQUEST_LIST:
      return { ...state, friendRequestList: [...action.payload.friendRequestList] };
    case types.LOGOUT_USER:
      return null;
    default:
      return state;
  }
};

export default userReducer;
