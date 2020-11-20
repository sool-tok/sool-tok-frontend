import * as types from './user.actionTypes';

const initialState = {
  currentUser: null,
  error: null,
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: payload.user,
        error: null,
      };
    case types.LOGOUT_USER_SUCCESS:
      return {
        ...state,
        currentUser: null,
        error: null,
      };
    case types.ADD_FRIEND_LIST_SUCCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser.friendList,
          friendList: [...payload.friendList],
        },
      };
    case types.ADD_FRIEND_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser.friendList,
          friendList: [...payload.friendRequestList],
        },
      };
    case types.SIGN_IN_FAILURE:
    case types.SIGN_OUT_FAILURE:
    case types.SIGN_UP_FAILURE:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};

export default userReducer;
