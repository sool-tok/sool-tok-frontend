import { call, put } from 'redux-saga/effects';

const createRequestSaga = (type, request) => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* saga(action) {
    try {
      const data = yield call(request, action.payload);
      yield put({ type: SUCCESS, payload: data });
    } catch (err) {
      yield put({ type: FAILURE, payload: err, error: true });
    }
  };
};

export default createRequestSaga;
