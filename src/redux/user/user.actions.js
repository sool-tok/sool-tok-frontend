import * as types from './user.actionTypes';

/* Login */
export const loginUserStart = () => ({
  type: types.LOGIN_USER_REQUESTED,
});

export const loginUserSuccess = user => ({
  type: types.LOGIN_USER_SUCCESS,
  payload: { user },
});

export const loginUserFailure = error => ({
  type: types.LOGIN_USER_FAILURE,
  payload: { error },
});

/* Logout */
export const logoutUserStart = () => ({
  type: types.LOGOUT_USER_REQUESTED,
});

export const logoutUserSuccess = () => ({
  type: types.LOGOUT_USER_SUCCESS,
});

export const logoutUserFailure = error => ({
  type: types.LOGOUT_USER_FAILURE,
  payload: { error },
});

/* FriendList */
export const addFriendListStart = () => ({
  type: types.ADD_FRIEND_LIST_REQUESTED,
});

export const addFriendListSuccess = list => ({
  type: types.ADD_FRIEND_LIST_SUCCESS,
  payload: { friendList: list },
});

export const addFriendListFailure = error => ({
  type: types.ADD_FRIEND_LIST_FAILURE,
  payload: { error },
});

/* FriendRequestList */
export const addFriendRequestListStart = () => ({
  type: types.ADD_FRIEND_REQUEST_LIST_SUCCESS,
});

export const addFriendRequestListSuccess = list => ({
  type: types.ADD_FRIEND_REQUEST_LIST_FAILURE,
  payload: { friendRequestList: list },
});

export const addFriendRequestListFailure = error => ({
  type: types.ADD_FRIEND_REQUEST_LIST,
  payload: { error },
});
