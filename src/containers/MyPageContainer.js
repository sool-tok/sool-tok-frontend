import { connect } from 'react-redux';

import * as userSelector from '../redux/user/user.selectors';
import * as userAction from '../redux/user/user.actions';

import MyPage from '../components/MyPage';

import { userService } from '../utils/api';

const mapStateToProps = state => ({
  loading: userSelector.selectLoading(state),
  error: userSelector.selectError(state),
  user: userSelector.selectCurrentUser(state),
  friendList: userSelector.selectfriendList(state) || [],
  friendRequestList: userSelector.selectFriendRequestList(state) || [],
});

const mapDispatchToProps = dispatch => ({
  addFriendList: userId => dispatch(userAction.addFriendListStart(userId)),
  addFriendRequestList: userId =>
    dispatch(userAction.addFriendRequestListStart(userId)),
  logoutUser: userId => dispatch(userAction.logoutUserStart(userId)),
  async onSubmit(userId, isAccepted, targetUserId) {
    try {
      const friendRequestList = await userService.responseFriendRequest(
        userId,
        isAccepted,
        targetUserId,
      );

      dispatch(userAction.addFriendRequestListSuccess(friendRequestList));
    } catch (err) {
      console.error(err);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
