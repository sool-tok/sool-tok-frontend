import types from './user.actionTypes';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.LOGIN_USER_REQUESTED:
    case types.LOGOUT_USER_REQUESTED:
    case types.ADD_FRIEND_LIST_REQUESTED:
    case types.ADD_FRIEND_REQUEST_LIST_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: payload.user,
        loading: false,
        error: null,
      };
    case types.LOGOUT_USER_SUCCESS:
      return {
        ...state,
        currentUser: null,
        loading: false,
        error: null,
      };
    case types.ADD_FRIEND_LIST_SUCCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          friendList: [...payload.friendList],
        },
        loading: false,
        error: null,
      };
    case types.ADD_FRIEND_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          friendRequestList: [...payload.friendRequestList],
        },
        loading: false,
        error: null,
      };
    case types.LOGIN_USER_FAILURE:
    case types.LOGOUT_USER_FAILURE:
    case types.ADD_FRIEND_LIST_FAILURE:
    case types.ADD_FRIEND_REQUEST_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    default:
      return state;
  }
};

export default userReducer;
