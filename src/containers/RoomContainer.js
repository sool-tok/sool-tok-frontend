import { connect } from 'react-redux';

import * as userSelector from '../redux/user/user.selectors';
import * as chatSelector from '../redux/chat/chat.selectors';

import * as roomAction from '../redux/room/room.actions';
import * as chatAction from '../redux/chat/chat.actions';

import Room from '../components/Room';

const mapStateToProps = state => ({
  user: userSelector.selectRequiredInRoom(state),
  room: state.room,
  chatList: chatSelector.selectChatList(state),
  unreadChatCount: chatSelector.selectUnreadCount(state),
});

const mapDispatchToProps = dispatch => ({
  renderRoom(room) {
    dispatch(roomAction.renderRoom(room));
  },
  destroyRoom() {
    dispatch(roomAction.destroyRoom());
  },
  addMember(member) {
    dispatch(roomAction.addMember(member));
  },
  deleteMember(memberId) {
    dispatch(roomAction.deleteMember(memberId));
  },
  updateRoomLockingStatus(isLocked) {
    dispatch(roomAction.updateRoomLockingStatus(isLocked));
  },
  addChat(chat) {
    dispatch(chatAction.addChat(chat));
  },
  resetChat() {
    dispatch(chatAction.resetChat());
  },
  increaseUnreadCount() {
    dispatch(chatAction.increaseUnreadCount());
  },
  resetUnreadCount() {
    dispatch(chatAction.resetUnreadCount());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
