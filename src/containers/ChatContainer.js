import { connect } from 'react-redux';

import Chat from '../components/Chat';
import * as chatAction from '../actions/chatAction';

const mapStateToProps = state => ({
  author: state.author,
  message: state.message,
  id: state.id,
  socket: state.socket,
});

const mapDispatchToProps = dispatch => ({
  addMessage(message) {
    dispatch(chatAction.addMessage(message));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
