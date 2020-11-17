import { connect } from 'react-redux';

import Chat from '../components/Chat';
import * as chatAction from '../actions/chatAction';

const mapStateToProps = state => ({
  user: state.user,
  chatList: state.chatList,
  socket: state.socket,
});

const mapDispatchToProps = dispatch => ({
  addChat(chat) {
    dispatch(chatAction.addChat(chat));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
