import axios from 'axios';

import { userService } from './api';

const FAKE_URL = 'http://fakeUrl';
const FAKE_DATA = 'fakeData';
const FAKE_TOKEN = 'fakeToken';
const FAKE_JSON = { data: FAKE_DATA };
const FAKE_BODY = { body: FAKE_DATA };

jest.mock('axios', () => {
  return {
    get: jest.fn(),
    defaults: {
      baseURL: FAKE_URL,
    },
  };
});

beforeEach(() => {
  localStorage.setItem('jwt-token', FAKE_TOKEN);
});

// afterEach(() => {
//   localStorage.removeItem('jwt-token');

//   window.fetch = savedFetch;
// });


describe('api call test', () => {
  it('get method should call fetch with path', async () => {
    const USER_ID = '123';
    const FRIEND_LIST = ['1', '2'];
    axios.get.mockImplementation(input => ({
      data: {
        friendList: FRIEND_LIST,
      },
    }));

    const result = await userService.getFriendList(USER_ID);

    expect(result).toEqual(['1', '2']);
    expect(axios.get.mock.calls[0][1].headers['jwt-token']).toEqual(FAKE_TOKEN);
    expect(axios.get.mock.calls[0][0]).toEqual(`/users/${USER_ID}/friends`);

    return;
  });

  it('post method should call fetch with path and body', async () => {
    const result = await axios.post({ path: FAKE_URL, body: FAKE_BODY });

    expect(result).toEqual(FAKE_DATA);
    expect(fetch.mock.calls[0][0]).toEqual(FAKE_URL);
    expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(FAKE_BODY));
    expect(fetch.mock.calls[0][1].headers.authorization).toEqual(FAKE_TOKEN);

    return;
  });

  // it('put method should call fetch with path and body', async () => {
  //   const result = await axios.put({ path: FAKE_URL, body: FAKE_BODY });

  //   expect(result).toEqual(FAKE_DATA);
  //   expect(fetch.mock.calls[0][0]).toEqual(FAKE_URL);
  //   expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(FAKE_BODY));
  //   expect(fetch.mock.calls[0][1].headers.authorization).toEqual(FAKE_TOKEN);

  //   return;
  // });
});
