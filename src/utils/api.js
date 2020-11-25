import firebase from './firebase';
import axios from 'axios';

// Test
// axios.defaults.baseURL = process.env.REACT_APP_PROXY_URL;

const setToken = token => localStorage.setItem('jwt-token', token);
const getToken = () => localStorage.getItem('jwt-token');
const removeToken = () => localStorage.removeItem('jwt-token');

const googleLogin = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    const { user } = await firebase.auth().signInWithPopup(provider);
    const userInfo = {
      email: user.email,
      name: user.displayName,
      photoUrl: user.photoURL,
    };

    const { data } = await axios.post('/users/login/google', userInfo);
    setToken(data.token);
    return { user: data.user };
  } catch (err) {
    throw new Error(err);
  }
};

const tokenLogin = async () => {
  try {
    const token = getToken();

    if (!token) return { user: null };

    const { data } = await axios.post('/users/login/token', { token });

    if (data.result === 'error') throw new Error(data);
    return { user: data.user };
  } catch (err) {
    throw new Error(err);
  }
};

const logout = async userId => {
  try {
    const token = getToken();

    await axios.post(`/users/${userId}/logout`, null, {
      headers: {
        'jwt-token': token,
      },
    });

    removeToken();
  } catch (err) {
    throw new Error(err);
  }
};

const getFriendList = async userId => {
  try {
    const token = getToken();

    const { data } = await axios.get(`/users/${userId}/friends`, {
      headers: {
        'jwt-token': token,
      },
    });

    if (data.result === 'error') throw new Error(data);
    return data.friendList;
  } catch (err) {
    throw new Error(err);
  }
};

const getFriendRequestList = async userId => {
  try {
    const token = getToken();

    const { data } = await axios.get(`/users/${userId}/friends/request`, {
      headers: {
        'jwt-token': token,
      },
    });

    if (data.result === 'error') throw new Error(data);
    return data.friendRequestList;
  } catch (err) {
    throw new Error(err);
  }
};

const requestFriend = async (userId, token, email) => {
  try {
    const { data } = await axios.post(
      `/users/${userId}/friends/request`,
      { email },
      {
        headers: {
          'jwt-token': token,
        },
      },
    );

    return { message: data.message };
  } catch (err) {
    throw err.response.data;
  }
};

const responseFriendRequest = async (userId, isAccepted, targetUserId) => {
  try {
    const token = getToken();

    const { data } = await axios.put(
      `/users/${userId}/friends/request`,
      {
        isAccepted,
        target_user_id: targetUserId,
      },
      {
        headers: {
          'jwt-token': token,
        },
      },
    );

    if (data.result === 'error') throw new Error(data);
    return data.friendRequestList;
  } catch (err) {
    throw new Error(err);
  }
};

const userService = {
  googleLogin,
  tokenLogin,
  logout,
  getFriendList,
  getFriendRequestList,
  requestFriend,
  responseFriendRequest,
};

export { userService };
