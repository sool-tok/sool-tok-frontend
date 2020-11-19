import { connect } from 'react-redux';

import Room from '../components/Room';
import * as roomAction from '../actions/roomAction';
import * as chatAction from '../actions/chatAction';

const mapStateToProps = state => ({
  user: state.user && {
    _id: state.user._id,
    name: state.user.name,
    photoUrl: state.user.photoUrl,
  },
  room: state.room,
  chatList: state.chatList,
});

const mapDispatchToProps = dispatch => {
  return {
    renderRoom(room) {
      dispatch(roomAction.renderRoom(room));
    },
    addMember(member) {
      dispatch(roomAction.addMember(member));
    },
    deleteMember(memberId) {
      dispatch(roomAction.deleteMember(memberId));
    },
    deleteRoom() {
      dispatch(roomAction.deleteRoom());
    },
    addChat(chat) {
      dispatch(chatAction.addChat(chat));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
