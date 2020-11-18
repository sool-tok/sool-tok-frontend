import firebase from './firebase';
import axios from 'axios';

// Test
axios.defaults.baseURL = process.env.REACT_APP_PROXY_URL;

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
    return { user: data.user, token: data.token };
  } catch (err) {
    console.error(err);
  }
};

const tokenLogin = async token => {
  try {
    const { data } = await axios.post('/users/login/token', { token });
    if (data.result === 'error') throw new Error(data);

    return { user: data.user };
  } catch (err) {
    console.error(err);
    return;
  }
};

const logout = async (id, token) => {
  try {
    await axios.post(`/users/${id}/logout`, null, {
      headers: {
        'jwt-token': token,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

const getFriendList = async (id, token) => {
  try {
    const { data } = await axios.get(`/users/${id}/friends`, {
      headers: {
        'jwt-token': token,
      },
    });
    if (data.result === 'error') throw new Error(data);
    return data.friendList;
  } catch (err) {
    console.error(err);
  }
};

const getFriendRequestList = async (id, token) => {
  try {
    const { data } = await axios.get(`/users/${id}/friends/request`, {
      headers: {
        'jwt-token': token,
      },
    });

    if (data.result === 'error') throw new Error(data);
    return data.friendRequestList;
  } catch (err) {
    console.error(err);
  }
};

const requestFriend = async (id, token, email) => {
  try {
    const { data } = await axios.post(`/users/${id}/friends/request`, { email }, {
      headers: {
        'jwt-token': token,
      },
    });

    if (data.status === 204) throw new Error('The user does not exist');
    return { message: data.message };
  } catch (err) {
    console.error(err);
  }
};

const responseFriendRequest = async (id, token, isAccepted, targetUserId) => {
  try {
    const { data } = await axios.put(`/users/${id}/friends/request`, {
      isAccepted,
      target_user_id: targetUserId,
    }, {
      headers: {
        'jwt-token': token,
      },
    });

    if (data.result === 'error') throw new Error(data);
    return data.friendRequestList;
  } catch (err) {
    console.error(err);
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
