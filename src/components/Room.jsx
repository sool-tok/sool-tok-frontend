import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Peer from 'simple-peer';

import { roomSocket, chatSocket, peerSocket, getMySocketId } from '../utils/socket';

import Video, { StyledVideo } from './Video';
import SpeechGame from './SpeechGame';
import Chat from './Chat';
import Button from './Button';
import ErrorBox from './ErrorBox';

import theme from './styles/theme';
import { BsUnlockFill, BsLockFill, BsFillChatDotsFill } from 'react-icons/bs';
import { FaVideo, FaVideoSlash, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { IoIosExit } from 'react-icons/io';
import { toast } from 'react-toastify';

import bomb from '../assets/bomb.png';
import explosion from '../assets/explosion.gif';

function Room({
  user,
  room,
  renderRoom,
  destroyRoom,
  addMember,
  deleteMember,
  updateRoomLockingStatus,
  chatList,
  unreadChatCount,
  addChat,
  increaseUnreadCount,
  resetUnreadCount,
}) {
  const history = useHistory();
  const { room_id: roomId } = useParams();

  const [isFinalGame, setFinalGame] = useState(false);
  const [isMyTurn, setMyTurn] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('');

  const [isHost, setIsHost] = useState(false);
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamOptions, setStreamOptions] = useState({});
  const [error, setError] = useState('');
  const [peers, setPeers] = useState({});
  const peersRef = useRef({});
  const streamRef = useRef();
  const myVideoRef = useRef();

  useEffect(() => {
    if (!isFinalGame) return;
    setTimeout(() => {
      setFinalGame(false);
    }, 2000);
  }, [isFinalGame]);

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
        setStreamOptions({ audio: true, video: true });
      } catch (error) {
        setError(error.message);
      }
    });

    roomSocket.listenUpdateRoomLockingStatus(({ isLocked }) =>
      updateRoomLockingStatus(isLocked),
    );
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

      destroyRoom();

      if (!streamRef.current) return;

      streamRef.current.getVideoTracks().forEach(track => {
        track.stop();
        streamRef.current.removeTrack(track);
      });
    };
  }, []);

  useEffect(() => {
    if (isChatRoomOpen) return;

    if (chatList.length) {
      increaseUnreadCount();
    }
  }, [chatList, isChatRoomOpen]);

  useEffect(() => {
    resetUnreadCount();
  }, [isChatRoomOpen]);

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

  const handleLockingRoom = () => {
    roomSocket.updateRoomLockingStatus({
      roomId: room._id,
      isLocked: !room.isLocked,
    });
  };

  const handleAudioTrack = () => {
    if (streamOptions.audio) {
      streamRef.current
        .getAudioTracks()
        .forEach(track => (track.enabled = false));
      setStreamOptions(prev => ({ ...prev, audio: false }));
    } else {
      streamRef.current
        .getAudioTracks()
        .forEach(track => (track.enabled = true));
      setStreamOptions(prev => ({ ...prev, audio: true }));
    }
  };

  const handleVideoTrack = () => {
    if (streamOptions.video) {
      streamRef.current
        .getVideoTracks()
        .forEach(track => (track.enabled = false));
      setStreamOptions(prev => ({ ...prev, video: false }));
    } else {
      streamRef.current
        .getVideoTracks()
        .forEach(track => (track.enabled = true));
      setStreamOptions(prev => ({ ...prev, video: true }));
    }
  };

  const copyRoomUrl = () => {
    const temp = document.createElement('textarea');
    temp.value = window.location.href;
    document.body.appendChild(temp);

    temp.select();
    document.execCommand('copy');
    toast('Url이 복사되었습니다', { type: toast.TYPE.DARK });
    document.body.removeChild(temp);
  };

  if (error) {
    return <ErrorBox message={error} text='메인으로' />;
  }

  return (
    <Container>
      {room && (
        <>
          <Button onClick={() => setIsChatRoomOpen(!isChatRoomOpen)}>
            <BsFillChatDotsFill size={28} />
            {!!unreadChatCount && <Badge>{unreadChatCount}</Badge>}
          </Button>
          {isChatRoomOpen && (
            <Chat
              onSubmit={newChat => chatSocket.sendMessage({ newChat })}
              chatList={chatList}
              user={user}
            />
          )}
          <Header>
            <div>
              <h1>{room.title}</h1>
              <span>{room.isLocked ? <BsLockFill /> : <BsUnlockFill />}</span>
            </div>
            <Button onClick={copyRoomUrl}>URL 복사</Button>
          </Header>
          <Wrapper>
            <GameBox isMyTurn={isMyTurn}>
              <SpeechGame
                roomId={roomId}
                isMyTurn={isMyTurn}
                setMyTurn={setMyTurn}
                currentTurn={currentTurn}
                setCurrentTurn={setCurrentTurn}
                setFinalGame={setFinalGame}
              />
            </GameBox>
            <MemberList>
              {room.memberList.map(member => (
                <MemberBlock key={member.socketId}>
                  {
                    currentTurn === member.socketId && !isFinalGame &&
                    <img src={bomb} alt='bomb' />
                  }
                  {
                    currentTurn === member.socketId && isFinalGame &&
                    <img className='explosion' src={explosion} alt='explosion' />
                  }
                  {member.socketId === getMySocketId() ? (
                    <StyledVideo
                      thumbnail={member.photoUrl}
                      ref={myVideoRef}
                      autoPlay
                      playsInline
                      muted
                    />
                  ) : (
                    <Video
                      thumbnail={member.photoUrl}
                      peer={peers[member.socketId]}
                    />
                  )}
                  <h3>{member.name}</h3>
                </MemberBlock>
              ))}
            </MemberList>
          </Wrapper>
          <UtilityBox>
            <div>
              {isHost && (
                <Button
                  color={room.isLocked ? theme.red : theme.lightGray}
                  onClick={handleLockingRoom}>
                  {room.isLocked ? (
                    <BsLockFill color={theme.lightGray} size={24} />
                  ) : (
                    <BsUnlockFill size={24} />
                  )}
                </Button>
              )}
              <Button
                color={streamOptions.audio ? theme.green : theme.lightGray}
                onClick={handleAudioTrack}>
                {streamOptions.audio ? (
                  <FaVolumeUp size={24} />
                ) : (
                  <FaVolumeMute size={24} />
                )}
              </Button>
              <Button
                color={streamOptions.video ? theme.green : theme.lightGray}
                onClick={handleVideoTrack}>
                {streamOptions.video ? (
                  <FaVideo size={24} />
                ) : (
                  <FaVideoSlash size={24} />
                )}
              </Button>
              <IoIosExit
                onClick={() => history.push('/')}
                size={42}
                cursor='pointer'
                color={theme.red}
              />
            </div>
          </UtilityBox>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.purple};

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
  width: inherit;
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
  }

  h1 {
    margin: 0 16px 0 24px;
    font-size: 28px;
    color: ${({ theme }) => theme.orange};
  }

  span {
    font-size: 21px;
    color: ${({ theme }) => theme.red};
  }

  button {
    background-color: rgba(0, 0, 0, 0);
    margin-right: 24px;
    color: ${({ theme }) => theme.green};
    text-decoration: underline;
  }
`;

const GameBox = styled.div`
  min-width: 400px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 320px;
    height: 400px;
    border-radius: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ isMyTurn, theme }) => isMyTurn ? theme.orange : theme.darkPurple};
  }
`;

const UtilityBox = styled.div`
  z-index: 100;
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
    display: flex;
    align-items: center;
    padding: 10px 24px;
    border-radius: 20px;
    margin-bottom: 24px;
    background-color: ${({ theme }) => theme.darkPurple};;
  }

  button:not(:last-child) {
    margin-right: 16px;
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
  position: relative;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    margin-top: 24px;
    font-size: 18px;
    color: ${({ theme }) => theme.orange};
  }

  img {
    z-index: 10;
    position: absolute;
    top: -92px;
    left: -3px;
    width: 129%;
  }

  img.explosion {
    left: -36px;
    mix-blend-mode: screen;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: red;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 18px;
  color: ${({ theme }) => theme.red};
`;

export default Room;

Room.propTypes = {
  user: PropTypes.object,
  room: PropTypes.object,
  chatList: PropTypes.array,
  unreadChatCount: PropTypes.number,
  renderRoom: PropTypes.func.isRequired,
  destroyRoom: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  addChat: PropTypes.func.isRequired,
  increaseUnreadCount: PropTypes.func.isRequired,
  resetUnreadCount: PropTypes.func.isRequired,
  updateRoomLockingStatus: PropTypes.func.isRequired,
};
