import { connect } from 'react-redux';

import * as roomAction from '../redux/room/room.actions';
import * as chatAction from '../redux/chat/chat.actions';

import Room from '../components/Room';

const mapStateToProps = state => ({
  user: state.user && {
    _id: state.user._id,
    name: state.user.name,
    photoUrl: state.user.photoUrl,
  },
  room: state.room,
  chat: state.chat,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
