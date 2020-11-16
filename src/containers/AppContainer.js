import { connect } from 'react-redux';
import io from 'socket.io-client';

import App from '../components/App';
import { userService } from '../utils/api';
import { loginUser } from '../actions/actionCreator';
import * as socketAction from '../actions/socketAction';

const mapStateToProps = state => ({ user: state.user });

const mapDispatchToProps = dispatch => ({
  async onLoad() {
    const token = localStorage.getItem('jwt-token');
    const socket = io(process.env.REACT_APP_PROXY_URL);
    dispatch(socketAction.openSocket(socket));

    if (token) {
      const { user } = await userService.tokenLogin(token);
      dispatch(loginUser(user));
      socket.emit('new user', { userId: user._id });
    }
  },
  async onLogin() {
    try {
      const { user, token } = await userService.googleLogin();
      localStorage.setItem('jwt-token', token);
      dispatch(loginUser(user));
    } catch (err) {
      console.error(err);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
