/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import styled from 'styled-components';

import Button from './Button';
// import Video from './Video';

const getVideoStream = async () => {
  // localhost에서만 작동
  // 다른 프로그램에서 해당 장치를 사용 중인 경우 이 에러가 발생
  // 테스트불가....
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  return stream;
};

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const Video = ({ peer }) => {
  console.log('📌 : Video -> peer', peer);
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

function Room({ user, socket, room, joinRoom, leaveRoom, updateMember }) {
  const history = useHistory();
  const { room_id: roomId } = useParams();
  // const [isHost, setHost] = useState(false);
  const [error, setError] = useState('');
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const peersRef = useRef([]);
  const videoRef = useRef();

  useEffect(() => {
    if (!socket) return;

    socket.emit('join room', { roomId, user }, async ({ room, message }) => {
      if (!room) return setError(message);
      // 1. 방 렌더
      joinRoom(room);

      // 2. 멀티미디어 접근 권한 요청 & 스트림 설정
      const stream = await getVideoStream();
      setStream(stream);
      videoRef.current.srcObject = stream;
    });
    return () => {
      if (!socket) return;
      socket.emit('leave room', { roomId, userId: user.id });
      leaveRoom();
    };
  }, [socket]);

  useEffect(() => {
    if (!room) return;

    if (user.id === room.memberList?.[0].id) {
      // setHost(true);
    }
  }, [room]);

  useEffect(() => {
    console.log('📌 : Room -> peers', peers);
  }, [peers]);

  useEffect(() => {
    if (!stream) return;
    console.log('📌 : Room -> stream');

    // 3. 나빼고 나머지 멤버들에게 peer sending (sending->receiving->returning)
    for (const member of room.memberList) {
      const peer = new Peer({ initiator: true, stream });

      const caller = socket.id;
      const receiver = member.socketId;

      if (caller === receiver) continue;

      peer.on('signal', signal => {
        socket.emit('sending signal', { caller, receiver, signal });
      });

      peersRef.current.push({ id: receiver, peer });
      setPeers(prev => [...prev, peer]);
    }

    /* ----SERVER-----
      socket.on('sending signal', ({ caller, receiver, signal }) => {
        io.to(receiver).emit('receiving signal', { caller, signal });
      });
    ----SERVER----- */

    // 4. peer receiving해서 다시 리턴 (sending->receiving->returning)
    socket.on('receiving signal', ({ caller, signal: incomingSignal }) => {
      const peer = new Peer({ initiator: false, stream });

      peer.on('signal', signal => {
        socket.emit('returning signal', { caller, signal });
      });

      peer.signal(incomingSignal);

      peersRef.current.push({ id: caller, peer });
      setPeers(prev => [...prev, peer]);
    });

    /* ----SERVER-----
      socket.on('returning signal', ({ caller, signal }) => {
        io.to(caller).emit('receiving returned signal', { id: socket.id, signal });
      });
    ----SERVER----- */

    // 5. 리턴된 시그널 받기 (sending->receiving->returning)
    socket.on('receiving returned signal', ({ id, signal }) => {
      const item = peersRef.current.find(peer => peer.id === id);
      item.peer.signal(signal);
    });
  }, [stream]);

  if (!room) {
    return (
      <div>
        <h1>{error}</h1>
        <Button onClick={() => history.push('/')} text='메인으로' />
      </div>
    );
  }

  return (
    <Container>
      <StyledVideo muted ref={videoRef} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
      <Button onClick={() => history.push('/')} text='메인으로' />
    </Container>
  );

  // return (
  //   <div
  //     style={{
  //       backgroundColor: 'lightskyblue',
  //       width: '100vw',
  //       height: '100vh',
  //       ...flexConfig,
  //     }}
  //   >
  //     <div style={{ position: 'fixed', top: '0', left: '0' }}>
  //       <h1>{room.roomName}</h1>
  //     </div>
  //     <div
  //       style={{
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(3, 1fr)',
  //         width: '100vw',
  //         height: '80vh',
  //       }}
  //     >
  //       <div style={{ order: '1', ...flexConfig }}>
  //         {room.memberList.map((member, idx) => {
  //           if ((idx + 1) % 2) {
  //             return (
  //               <Video
  //                 key={idx}
  //                 src=''
  //                 id={member.id}
  //                 username={member.name}
  //                 photoUrl={member.photoUrl}
  //               />
  //             );
  //           }
  //         })}
  //       </div>
  //       <div style={{ order: '3', ...flexConfig }}>
  //         {room.memberList.map((member, idx) => {
  //           if (!((idx + 1) % 2)) {
  //             return (
  //               <Video
  //                 key={idx}
  //                 src=''
  //                 id={member.id}
  //                 username={member.name}
  //                 photoUrl={member.photoUrl}
  //               />
  //             );
  //           }
  //         })}
  //       </div>
  //       <div
  //         style={{ backgroundColor: 'lightsalmon', order: '2', ...flexConfig }}
  //       >
  //         <div
  //           style={{
  //             backgroundColor: 'lightseagreen',
  //             width: '300px',
  //             height: '500px',
  //           }}
  //         >
  //           Game Center
  //         </div>
  //       </div>
  //     </div>
  //     <div
  //       style={{
  //         backgroundColor: 'lightyellow',
  //         width: '300px',
  //         height: '50px',
  //       }}
  //     >
  //       {isHost && <Button onClick={() => {}} text='방 잠금' />}
  //       <Button onClick={() => {}} text='음소거' />
  //       <Button onClick={() => {}} text='비디오 켜기' />
  //       <Button onClick={() => history.push('/')} text='방 나가기' />
  //     </div>
  //   </div>
  // );
}

export default Room;

Room.propTypes = {
  user: PropTypes.object,
  socket: PropTypes.object,
  room: PropTypes.object,
  joinRoom: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  updateMember: PropTypes.func.isRequired,
};

// const flexConfig = {
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'center',
// };
