import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Peer from 'simple-peer';

import Video, { StyledVideo } from './Video';
import ChatContainer from '../containers/ChatContainer';
import Button from './Button';
import FloatingButton from './FloatingButton';

function Room({ user, socket, room, joinRoom, leaveRoom, addMember, deleteMember }) {
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
    console.log('Current Peers :', peers);
  }, [peers]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join room', { roomId, user }, async ({ room, message }) => {
      if (!room) return setError(message);

      joinRoom(room);

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

    socket.on('member joined', ({ user }) => addMember(user));
    socket.on('member leaved', ({ userId }) => {
      delete peersRef.current[userId];
      setPeers(peers => {
        delete peers[userId];
        return peers;
      });
      deleteMember(userId);
    });

    return () => {
      if (!socket) return;

      streamRef.current.getVideoTracks().forEach(track => {
        track.stop();
        streamRef.current.removeTrack(track);
      });

      socket.emit('leave room', { roomId, userId: user.id });
      leaveRoom();
    };
  }, [socket]);

  useEffect(() => {
    if (room && user.id === room.memberList?.[0].id) {
      setIsHost(true);
    }
  }, [room]);

  useEffect(() => {
    if (!isStreaming) return;

    for (const member of room.memberList) {
      const sender = { ...user, socketId: socket.id };
      const receiver = member;

      if (sender.id === receiver.id) continue;

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: streamRef.current,
      });
      peer.on('signal', senderSignal => {
        socket.emit('sending signal', { sender, senderSignal, receiver });
      });

      peersRef.current[receiver.id] = peer;
      setPeers(prev => ({ ...prev, [receiver.id]: peer }));
    }

    /* ----SERVER-----
      socket.on('sending signal', ({ sender, senderSignal, receiver }) => {
        const { socketId } = receiver;
        io.to(socketId).emit('receiving signal', { sender, senderSignal });
      });
    ----SERVER----- */

    socket.on('receiving signal', ({ sender, senderSignal }) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: streamRef.current,
      });
      peer.signal(senderSignal);

      const receiver = { ...user, socketId: socket.id };
      peer.on('signal', receiverSignal => {
        socket.emit('returning signal', { receiver, receiverSignal, sender });
      });

      peersRef.current[sender.id] = peer;
      setPeers(prev => ({ ...prev, [sender.id]: peer }));
    });

    /* ----SERVER-----
      socket.on('returning signal', ({ receiver, receiverSignal, sender }) => {
        const { socketId } = sender;
        io.to(socketId).emit('receiving returned signal', { receiver, receiverSignal });
      });
    ----SERVER----- */

    socket.on('receiving returned signal', ({ receiver, receiverSignal }) => {
      const peer = peersRef.current[receiver.id];
      peer.signal(receiverSignal);
    });

    return () => {
      if (!isStreaming) return;
      socket.off('receiving signal');
      socket.off('receiving returned signal');
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
    <Wrapper>
      <h1>{room.roomName}</h1>
      <div className='container'>
        <div className='game-stage'>이곳은 게임판</div>
        <div className='members'>
          {room.memberList.map(member => (
            <div className='member-block' key={member.id}>
              <h3>{member.name}</h3>
              {member.id === user.id ? (
                <StyledVideo
                  thumbnail={member.photoUrl}
                  ref={myVideoRef}
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <Video
                  key={member.id}
                  thumbnail={member.photoUrl}
                  peer={peers[member.id]}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='util-bar'>
        <Button onClick={() => {}} text='음소거' />
        <Button onClick={() => {}} text='비디오 켜기' />
        <span>🍹🍺🍷</span>
        {isHost && <Button onClick={() => {}} text='방 잠금' />}
        <Button onClick={() => history.push('/')} text='방 나가기' />
      </div>
      <FloatingButton
        text='채팅하기'
        onClick={() => setIsChatRoomOpen(!isChatRoomOpen)}
      />
      {isChatRoomOpen && <ChatContainer />}
    </Wrapper>
  );
}

export default Room;

Room.propTypes = {
  user: PropTypes.object,
  socket: PropTypes.object,
  room: PropTypes.object,
  joinRoom: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
};

const Wrapper = styled.div`
  background-color: #eee;
  width: 100vw;
  height: 100vh;

  .container {
    width: 100%;
    height: 80%;
    display: flex;

    .game-stage {
      border: 1px solid indianred;
      width: 40%;
      height: 100%;
    }

    .members {
      width: 60%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .member-block {
        width: 300px;
        height: 300px;
        color: red;
        border: 1px solid indianred;
      }
    }
  }

  .util-bar {
    background-color: salmon;
    width: 50%;
    display: flex;
    justify-content: space-around;
  }
`;
