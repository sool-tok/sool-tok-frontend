import { connect } from 'react-redux';

import Lobby from '../components/Lobby';

const mapStateToProps = state => ({ socket: state.socket });

export default connect(mapStateToProps)(Lobby);
