import { connect } from 'react-redux';

import * as userAction from '../redux/user/user.actions';
import { userService } from '../utils/api';

import MyPage from '../components/MyPage';

const mapStateToProps = state => ({
  user: state.user,
  friendList: state.user?.friendList,
  friendRequestList: state.user?.friendRequestList,
});

const mapDispatchToProps = dispatch => ({
  async onLoad(user) {
    try {
      const token = localStorage.getItem('jwt-token');
      const friendList = await userService.getFriendList(user._id, token);

      dispatch(userAction.addFriendList(friendList));
    } catch (err) {
      console.error(err);
    }
  },
  async onLoadRequestList(user) {
    const token = localStorage.getItem('jwt-token');
    const requestFriendList = await userService.getFriendRequestList(user._id, token);
    dispatch(userAction.addFriendRequestList(requestFriendList));
  },
  async onLogout(user) {
    try {
      const token = localStorage.getItem('jwt-token');
      await userService.logout(user._id, token);

      dispatch(userAction.logoutUser());
      localStorage.removeItem('jwt-token');
    } catch (err) {
      console.error(err);
    }
  },
  async onSubmit(userId, isAccepted, targetUserId) {
    try {
      const token = localStorage.getItem('jwt-token');
      const friendRequestList = await userService.responseFriendRequest(
        userId,
        token,
        isAccepted,
        targetUserId,
      );
      dispatch(userAction.addFriendRequestList(friendRequestList));
    } catch (err) {
      console.error(err);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
