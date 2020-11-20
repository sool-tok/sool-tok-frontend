import { takeLatest, put, all, call } from 'redux-saga/effects';
// takeLates: 이녀석은 요청을 2번 할 경우 가장 최신의 요청만을 처리한다.

import * as types from './user.actionTypes';

// import createRequestSaga from '../../utils/asyncUtils';
import { userService } from '../../utils/api';

export function* loginUser() {
  try {
    const { user: userWithToken } = yield userService.tokenLogin();

    if (userWithToken) {
      yield put({
        type: types.LOGIN_USER_SUCCESS,
        payload: { user: userWithToken },
      });
      return;
    }

    const { user } = yield userService.googleLogin();
    yield put({
      type: types.LOGIN_USER_SUCCESS,
      payload: { user },
    });
  } catch (err) {
    yield put({
      type: types.LOGIN_USER_FAILURE,
      payload: err,
      error: true,
    });
  }
}

export function* logoutUser({ payload: userId }) {
  try {
    yield userService.logout(userId);
    yield put({
      type: types.LOGOUT_USER_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: types.LOGOUT_USER_FAILURE,
      payload: err,
      error: true,
    });
  }
}

export function* getFriendList({ payload: userId }) {
  try {
    const friendList = yield userService.getFriendList(userId);
    yield put({
      type: types.ADD_FRIEND_LIST_SUCCESS,
      payload: { friendList },
    });
  } catch (err) {
    yield put({
      type: types.ADD_FRIEND_LIST_FAILURE,
      payload: err,
      error: true,
    });
  }
}

export function* getFriendRequestList({ payload: userId }) {
  try {
    const friendRequestList = yield userService.getFriendRequestList(userId);
    yield put({
      type: types.ADD_FRIEND_REQUEST_LIST_SUCCESS,
      payload: { friendRequestList },
    });
  } catch (err) {
    yield put({
      type: types.ADD_FRIEND_REQUEST_LIST_FAILURE,
      payload: err,
      error: true,
    });
  }
}

export function* onLoginUserStart() {
  yield takeLatest(types.LOGIN_USER_REQUESTED, loginUser);
}

export function* onLogoutStart() {
  yield takeLatest(types.LOGOUT_USER_REQUESTED, logoutUser);
}

export function* onGetFriendListStart() {
  yield takeLatest(types.ADD_FRIEND_LIST_REQUESTED, getFriendList);
}

export function* onGetFriendRequestListStart() {
  yield takeLatest(
    types.ADD_FRIEND_REQUEST_LIST_REQUESTED,
    getFriendRequestList,
  );
}

export function* userSagas() {
  yield all([
    call(loginUser),
    call(logoutUser),
    call(getFriendList),
    call(getFriendRequestList),
    call(onLoginUserStart),
    call(onLogoutStart),
    call(onGetFriendListStart),
    call(onGetFriendRequestListStart),
  ]);
}
