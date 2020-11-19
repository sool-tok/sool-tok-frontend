import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Peer from 'simple-peer';

import { roomSocket, chatSocket, peerSocket } from '../utils/socket';

import Video, { StyledVideo } from './Video';
import SpeechGame from './SpeechGame';
import Chat from './Chat';
import Button from './Button';

function Room({
  user,
  room,
  renderRoom,
  deleteRoom,
  addMember,
  deleteMember,
  addChat,
  chatList,
}) {
  const history = useHistory();
  const { room_id: roomId } = useParams();
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [peers, setPeers] = useState({});
  const peersRef = useRef({});
  const streamRef = useRef();
  const myVideoRef = useRef();

  useEffect(() => {
    roomSocket.joinRoom({ roomId, user }, async ({ room, message }) => {
      if (!room) return setError(message);

      renderRoom(room);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myVideoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      } catch (error) {
        setError(error.message);
      }
    });

    roomSocket.listenMemberJoined(({ newMember }) => addMember(newMember));
    roomSocket.listenMemberLeaved(({ socketId }) => {
      delete peersRef.current[socketId];
      setPeers(peers => {
        const { [socketId]: targetPeer, ...restPeers } = peers;
        if (targetPeer) targetPeer.destroy();
        return restPeers;
      });

      deleteMember(socketId);
    });

    chatSocket.listenMessage(({ chat }) => addChat(chat));

    return () => {
      roomSocket.cleanUpRoomListener();
      chatSocket.cleanUpMessageListener();

      roomSocket.leaveRoom({ roomId });

      deleteRoom();

      if (!streamRef.current) return;

      streamRef.current.getVideoTracks().forEach(track => {
        track.stop();
        streamRef.current.removeTrack(track);
      });
    };
  }, []);

  useEffect(() => {
    if (room && user._id === room.memberList?.[0]._id) {
      setIsHost(true);
    }
  }, [room]);

  useEffect(() => {
    if (!isStreaming) return;

    for (const member of room.memberList) {
      if (user._id === member._id) continue;

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: streamRef.current,
      });

      peer.on('signal', signal => {
        peerSocket.sendingSignal({ signal, receiver: member });
      });

      peersRef.current[member.socketId] = peer;
      setPeers(prev => ({ ...prev, [member.socketId]: peer }));
    }

    peerSocket.listenSendingSignal(({ initiator, signal }) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: streamRef.current,
      });
      peer.signal(signal);

      peer.on('signal', signal => {
        peerSocket.returnSignal({ signal, receiver: initiator });
      });

      peersRef.current[initiator.socketId] = peer;
      setPeers(prev => ({ ...prev, [initiator.socketId]: peer }));
    });

    peerSocket.listenReturningSignal(({ returner, signal }) => {
      const peer = peersRef.current[returner.socketId];
      peer.signal(signal);
    });

    return () => {
      peerSocket.cleanUpPeerListener();
    };
  }, [isStreaming]);

  if (!room || error) {
    return (
      <div>
        <h1>{error}</h1>
        <Button onClick={() => history.push('/')} text='메인으로' />
      </div>
    );
  }

  return (
    <Container>
      <Button onClick={() => setIsChatRoomOpen(!isChatRoomOpen)}>C</Button>
      {isChatRoomOpen && (
        <Chat
          onSubmit={newChat => chatSocket.sendMessage({ newChat })}
          chatList={chatList}
          user={user}
        />
      )}
      <Header>
        <h1>{room.title}</h1>
      </Header>
      <Wrapper>
        <GameBox>
          <SpeechGame />
        </GameBox>
        <MemberList>
          {room.memberList.map(member => (
            <MemberBlock key={member.socketId}>
              {member._id === user._id ? (
                <StyledVideo
                  thumbnail={member.photoUrl}
                  ref={myVideoRef}
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <Video thumbnail={member.photoUrl} peer={peers[member.socketId]} />
              )}
              <h3>{member.name}</h3>
            </MemberBlock>
          ))}
        </MemberList>
      </Wrapper>
      <UtilityBox>
        <div>
          {isHost && <Button onClick={() => {}}>방 잠금</Button>}
          <Button onClick={() => {}}>음소거</Button>
          <Button onClick={() => {}}>비디오 켜기</Button>
          <Button onClick={() => history.push('/')}>방 나가기</Button>
        </div>
      </UtilityBox>
    </Container>
  );
}

const Container = styled.div`
  background-color: #49007d;
  width: 100vw;
  height: 100vh;

  h1 {
    padding: 24px;
    font-size: 24px;
    color: #ffd32a;
  }

  & > button {
    z-index: 999;
    width: 36px;
    height: 36px;
    padding: 12px;
    position: fixed;
    bottom: 24px;
    right: 100px;
    text-align: center;
  }
`;

const Wrapper = styled.div`
  display: flex;
  height: 92%;
`;

const Header = styled.header`
  width: 100vw;
  height: 8%;
  background-color: #330057;
`;

const GameBox = styled.div`
  min-width: 400px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 320px;
    height: 600px;
    border-radius: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #a9c9ff;
    background-image: linear-gradient(180deg, #a9c9ff 0%, #ffbbec 100%);
  }
`;

const UtilityBox = styled.div`
  z-index: 1;
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0px;
  bottom: 0px;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    background-color: #330057;
    padding: 10px 16px;
    border-radius: 20px;
    margin-bottom: 24px;
  }

  button:not(:last-child) {
    margin-right: 10px;
  }
`;

const MemberList = styled.div`
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MemberBlock = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    color: #eee;
    margin-top: 24px;
    font-size: 18px;
  }
`;

export default Room;

Room.propTypes = {
  user: PropTypes.object,
  room: PropTypes.object,
  chatList: PropTypes.array,
  renderRoom: PropTypes.func.isRequired,
  deleteRoom: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  addChat: PropTypes.func.isRequired,
};
