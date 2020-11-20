import { takeLatest, put, all, call } from 'redux-saga/effects';
// takeLates: 이녀석은 요청을 2번 할 경우 가장 최신의 요청만을 처리한다.

import * as types from './user.actionTypes';
import * as actions from './user.actions';

import { userService } from '../../utils/api';

export function* loginWithToken() {
  try {
    const response = yield userService.tokenLogin();
    yield put({
      type: types.LOGIN_USER_SUCCESS,
      payload: response.data,
      meta: response,
    });
  } catch (err) {
    yield put({ type: types.LOGIN_USER_FAILURE, payload: { err } });
  }
}

export function* logout({ payload: user }) {
  try {
    const token = localStorage.getItem('jwt-token');
    yield userService.logout(user._id, token);

    localStorage.removeItem('jwt-token');
    yield put({ type: types.LOGOUT_USER_SUCCESS });
  } catch (err) {
    yield put({ type: types.LOGOUT_USER_FAILURE, payload: { err } });
  }
}

export function* getFriendListAsync({ payload: user }) {
  try {
    const token = localStorage.getItem('jwt-token');
    const list = yield userService.getFriendList(user._id, token);

    yield put(actions.addFriendListSuccess(list));
  } catch (err) {
    yield put(actions.addFriendListFailure(err));
  }
}

export function* getFriendRequestListAsync({ payload: user }) {
  try {
    const token = localStorage.getItem('jwt-token');
    const list = yield userService.getFriendRequestList(user._id, token);

    yield put(actions.addFriendRequestListSuccess(list));
  } catch (err) {
    yield put(actions.addFriendRequestListFailure(err));
  }
}

// loginUserSuccess
// loginUserFailure
// logoutUserSuccess
// logoutUserFailure
// addFriendListSuccess
// addFriendListFailure
// addFriendRequestListSuccess
// addFriendRequestListFailure
