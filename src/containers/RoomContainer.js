import { connect } from 'react-redux';

import Room from '../components/Room';
import * as roomAction from '../actions/roomAction';
import * as chatAction from '../actions/chatAction';

const mapStateToProps = state => ({
  user: state.user && {
    id: state.user._id,
    name: state.user.name,
    photoUrl: state.user.photoUrl,
  },
  socket: state.socket,
  room: state.room,
  chatList: state.chatList,
});

const mapDispatchToProps = dispatch => {
  return {
    joinRoom(room) {
      dispatch(roomAction.joinRoom(room));
    },
    addMember(member) {
      dispatch(roomAction.addMember(member));
    },
    deleteMember(memberId) {
      dispatch(roomAction.deleteMember(memberId));
    },
    leaveRoom() {
      dispatch(roomAction.leaveRoom());
    },
    addChat(chat) {
      dispatch(chatAction.addChat(chat));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
