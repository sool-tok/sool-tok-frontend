import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from './Button';
import ModalPortal from './ModalPortal';
import Modal from './Modal';
import CreateRoomForm from './CreateRoomForm';
import JoinRoomForm from './JoinRoomForm';
import styled from 'styled-components';
import Table from './Table';

function Lobby({ socket }) {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setmodalContent] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (!socket) return;

    socket.emit('update room list');
    socket.on('update room list', ({ rooms }) => setTables(rooms));
  }, [socket]);

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
    <Container>
      <Tables>
        {tables &&
          tables.map(table => (
            <Table
              key={table.id}
              roomPath={table.id}
              roomName={table.roomName}
              memberList={table.memberList}
            />
          ))}
      </Tables>
      <h1>LOBBY</h1>
      <Wrapper>
        <Button
          onClick={() => openModal(<CreateRoomForm onSubmit={createRoom} />)}
        >
          + 테이블 잡기
        </Button>
        <Button
          onClick={() => openModal(<JoinRoomForm onSubmit={roomId => history.push(`rooms/${roomId}`)} />)}
        >
          URL로 참여하기
        </Button>
      </Wrapper>
      {isModalOpen && (
        <ModalPortal>
          <Modal setModalOpen={setModalOpen}>{modalContent}</Modal>
        </ModalPortal>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #49007d;

  h1 {
    font-size: 200px;
    font-weight: 700;
    color: #ffd32a;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  left: 24px;
  bottom: 24px;

  button {
    margin-right: 16px;
  }
`;

const Tables = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;

  a {
    text-decoration: none;
  }
`;

export default Lobby;

Lobby.propTypes = {
  socket: PropTypes.object,
};
