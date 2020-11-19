import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { roomSocket } from '../utils/socket';

import Table from './Table';
import ModalPortal from './ModalPortal';
import Modal from './Modal';
import CreateRoomForm from './CreateRoomForm';
import JoinRoomForm from './JoinRoomForm';
import Button from './Button';

function Lobby() {
  const history = useHistory();
  const [tables, setTables] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setmodalContent] = useState(null);

  useEffect(() => {
    roomSocket.updateRoomList();
    roomSocket.listenUpdateRoomList(({ rooms }) => setTables(rooms));

    return () => {
      roomSocket.cleanUpLobbyListener();
    };
  }, []);

  const moveToRoomPath = roomId => history.push(`rooms/${roomId}`);
  const createRoom = roomData =>
    roomSocket.createRoom({ roomData }, ({ roomId }) => moveToRoomPath(roomId));

  const openModal = modalContent => {
    setmodalContent(modalContent);
    setModalOpen(true);
  };

  return (
    <Container>
      <Tables>
        {tables.map(table => (
          <Table key={table._id} tableInfo={table} />
        ))}
      </Tables>
      <h1>LOBBY</h1>
      <Wrapper>
        <Button onClick={() => openModal(<CreateRoomForm onSubmit={createRoom} />)}>
          + 테이블 잡기
        </Button>
        <Button onClick={() => openModal(<JoinRoomForm onSubmit={moveToRoomPath} />)}>
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
