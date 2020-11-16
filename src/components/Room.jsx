import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import Button from './Button';
import Video from './Video';

function Room({ user, socket, room, joinRoom, leaveRoom, updateMember }) {
  const history = useHistory();
  const { room_id: roomId } = useParams();
  const [leftMemberList, setLeftMemberList] = useState([]);
  const [rightMemberList, setRightMemberList] = useState([]);
  const [isHost, setHost] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.emit('join room', { roomId, user }, ({ room, message }) => {
      if (!room) {
        setError(message);
      } else {
        joinRoom(room);
      }
    });

    socket.on('update memberList', ({ memberList }) => {
      updateMember(memberList);
    });
  }, [socket]);

  useEffect(() => {
    return () => {
      socket.emit('leave room', { roomId, userId: user.id });
      leaveRoom();
    };
  }, []);

  useEffect(() => {
    if (!room) return;

    if (user.id === room.memberList?.[0].id) {
      setHost(true);
    }

    const leftMember = [];
    const rightMember = [];

    if (room.memberList.length >= 1) {
      room.memberList.forEach((member, idx) => {
        if ((idx + 1) % 2) {
          leftMember.push(member);
        } else {
          rightMember.push(member);
        }
      });

      setLeftMemberList(leftMember);
      setRightMemberList(rightMember);
    }
  }, [room]);


  if (!room) {
    return (
      <div>
        <h1>{error}</h1>
        <Button onClick={() => {}} text='메인으로' />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'lightskyblue', width: '100vw', height: '100vh', ...flexConfig }}>
      {
        room &&
        <>
          <div style={{ position: 'fixed', top: '0', left: '0' }}>
            <h1>{room.roomName}</h1>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100vw', height: '80vh' }}>
            <div style={{ order: '1', ...flexConfig  }}>
              {/* {leftMemberList.map((member, idx) => (
                <Video
                  key={idx}
                  src=''
                  username={member.name}
                  photoUrl={member.photoUrl}
                />)
              )} */}
              {/* {room.memberList.map((member, idx) => {

                return (
                  <Video
                    key={idx}
                    src=''
                    username={member.name}
                    photoUrl={member.photoUrl}
                  />
                );
              })} */}
            </div>
            <div style={{ order: '3', ...flexConfig }}>
              {rightMemberList.map((member, idx) => (
                <Video
                  key={idx}
                  src=''
                  username={member.name}
                  photoUrl={member.photoUrl}
                />)
              )}
            </div>
            <div style={{ backgroundColor: 'lightsalmon', order: '2', ...flexConfig  }}>
              <div style={{ backgroundColor: 'lightseagreen', width: '300px', height: '500px' }}>
                Game Center
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: 'lightyellow', width: '300px', height: '50px' }}>
            {isHost && <Button onClick={() => {}} text='방 잠금' />}
            <Button onClick={() => {}} text='음소거' />
            <Button onClick={() => {}} text='비디오 켜기' />
            <Button onClick={() => history.push('/')} text='방 나가기' />
          </div>
        </>
      }
    </div>
  );
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

const flexConfig = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};
