import io from 'socket.io-client';

const socket = io();

export const getMySocketId = () => socket.id;

const gameSocket = {
  startGame(data) {
    socket.emit('start game', data);
  },
  sendGameStatus(status) {
    socket.emit('proceed game', status);
  },
  sendNextTurn(next) {
    socket.emit('turn change', next);
  },
  sendResetGame(roomId) {
    socket.emit('reset game', roomId);
  },
  listenInitailizingGame(cb) {
    socket.on('initializing game', cb);
  },
  listenProceedGame(cb) {
    socket.on('proceed game', cb);
  },
  listenTurnChange(cb) {
    socket.on('turn change', cb);
  },
  listenResetGame(cb) {
    socket.on('reset game', cb);
  },
  cleanUpGameListener() {
    socket.off('initializing game');
    socket.off('proceed game');
    socket.off('turn change');
    socket.off('reset game');
  },
};

const roomSocket = {
  createRoom({ roomData }, cb) {
    socket.emit('create room', { roomData }, cb);
  },
  updateRoomList() {
    socket.emit('update room list');
  },
  joinRoom({ roomId, user }, cb) {
    socket.emit('join room', { roomId, user }, cb);
  },
  leaveRoom({ roomId }) {
    socket.emit('leave room', { roomId });
  },
  updateRoomLockingStatus({ roomId, isLocked }) {
    socket.emit('update room locking status', { roomId, isLocked });
  },
  listenUpdateRoomList(cb) {
    socket.on('update room list', cb);
  },
  listenMemberJoined(cb) {
    socket.on('member joined', cb);
  },
  listenMemberLeaved(cb) {
    socket.on('member leaved', cb);
  },
  listenUpdateRoomLockingStatus(cb) {
    socket.on('update room locking status', cb);
  },
  renderFilter({ roomId, isFilterOn, filter }) {
    socket.emit('video filter', { roomId, isFilterOn, filter });
  },
  listenRenderFilter(cb) {
    socket.on('video filter', cb);
  },
  cleanUpLobbyListener() {
    socket.off('update room list');
  },
  cleanUpRoomListener() {
    socket.off('member joined');
    socket.off('member leaved');
    socket.off('update room locking status');
    socket.off('video filter');
  },
};

const chatSocket = {
  sendMessage({ newChat }) {
    socket.emit('message', { chat: newChat });
  },
  listenMessage(cb) {
    socket.on('message', cb);
  },
  cleanUpMessageListener() {
    socket.off('message');
  },
};

const peerSocket = {
  sendingSignal({ signal, receiver }) {
    socket.emit('sending signal', { signal, receiver });
  },
  listenSendingSignal(cb) {
    socket.on('sending signal', cb);
  },
  returnSignal({ signal, receiver }) {
    socket.emit('returning signal', { signal, receiver });
  },
  listenReturningSignal(cb) {
    socket.on('returning signal', cb);
  },
  cleanUpPeerListener() {
    socket.off('sending signal');
    socket.off('returning signal');
  },
};

export { roomSocket, chatSocket, peerSocket, gameSocket };
