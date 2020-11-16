import { connect } from 'react-redux';

import Room from '../components/Room';
import * as roomAction from '../actions/roomAction';

const mapStateToProps = state => ({
  user: state.user && { id: state.user._id, name: state.user.name },
  socket: state.socket,
  room: state.room,
});

const mapDispatchToProps = dispatch => {
  return {
    joinRoom(room) {
      dispatch(roomAction.joinRoom(room));
    },
    leaveRoom() {
      dispatch(roomAction.leaveRoom());
    },
    updateMember(memberList) {
      dispatch(roomAction.updateMember(memberList));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
