import { takeLatest, put, all, call } from 'redux-saga/effects';
// takeLates: 이녀석은 요청을 2번 할 경우 가장 최신의 요청만을 처리한다.

import types from './user.actionTypes';
import * as actions from './user.actions';

// import createRequestSaga from '../../utils/asyncUtils';
import { userService } from '../../utils/api';

export function* loginUser({ payload }) {
  try {
    const { loginType } = payload;
    let authorizedUser;

    if (loginType === 'token') {
      const { user } = yield userService.tokenLogin();
      authorizedUser = user;
    }

    if (loginType === 'google') {
      const { user } = yield userService.googleLogin();
      authorizedUser = user;
    }

    console.log('📌 : function*loginUser -> authorizedUser', authorizedUser);
    yield put(actions.loginUserSuccess(authorizedUser));
  } catch (err) {
    yield put(actions.loginUserFailure(err));
  }
}

export function* logoutUser({ payload }) {
  try {
    const { userId } = payload;
    yield userService.logout(userId);
    yield put(actions.logoutUserSuccess());
  } catch (err) {
    yield put(actions.logoutUserFailure(err));
  }
}

export function* getFriendList({ payload }) {
  try {
    const { userId } = payload;
    const friendList = yield userService.getFriendList(userId);
    yield put(actions.addFriendListSuccess(friendList));
  } catch (err) {
    yield put(actions.addFriendListFailure(err));
  }
}

export function* getFriendRequestList({ payload }) {
  try {
    const { userId } = payload;
    const friendRequestList = yield userService.getFriendRequestList(userId);
    yield put(actions.addFriendRequestListSuccess(friendRequestList));
  } catch (err) {
    yield put(actions.addFriendRequestListFailure(err));
  }
}

export function* watchLoginUserStart() {
  yield takeLatest(types.LOGIN_USER_REQUESTED, loginUser);
}

export function* watchLogoutStart() {
  yield takeLatest(types.LOGOUT_USER_REQUESTED, logoutUser);
}

export function* watchGetFriendListStart() {
  yield takeLatest(types.ADD_FRIEND_LIST_REQUESTED, getFriendList);
}

export function* watchGetFriendRequestListStart() {
  yield takeLatest(
    types.ADD_FRIEND_REQUEST_LIST_REQUESTED,
    getFriendRequestList,
  );
}

export default function* userSagas() {
  yield all([
    call(watchLoginUserStart),
    call(watchLogoutStart),
    call(watchGetFriendListStart),
    call(watchGetFriendRequestListStart),
  ]);
}
