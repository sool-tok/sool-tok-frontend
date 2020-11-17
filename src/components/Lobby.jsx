import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from './Button';
import ModalPortal from './ModalPortal';
import Modal from './Modal';
import CreateRoomForm from './CreateRoomForm';
import JoinRoomForm from './JoinRoomForm';

function Lobby({ socket }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setmodalContent] = useState(null);
  const history = useHistory();

  const createRoom = roomData => {
    socket.emit('create room', { roomData }, ({ room }) => {
      history.push(`/rooms/${room.id}`);
    });
  };

  const openModal = element => {
    setmodalContent(element);
    setModalOpen(true);
  };

  return (
    <div>
      <h1>LOBBY</h1>
      <Button
        onClick={() => openModal(<CreateRoomForm onSubmit={createRoom} />)}
        text='+ 테이블 잡기'
      />
      <Button
        onClick={() => openModal(<JoinRoomForm onSubmit={roomId => history.push(`rooms/${roomId}`)} />)}
        text='URL로 참여하기'
      />
      {isModalOpen && (
        // <ModalPortal>
          <Modal setModalOpen={setModalOpen}>{modalContent}</Modal>
        // </ModalPortal>
      )}
    </div>
  );
}

export default Lobby;

Lobby.propTypes = {
  socket: PropTypes.object,
};
