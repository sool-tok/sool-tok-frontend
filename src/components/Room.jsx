import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import Button from './Button';
import Video from './Video';

function Room({ user, socket, room, joinRoom, leaveRoom, updateMember }) {
  const history = useHistory();
  const { room_id: roomId } = useParams();
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

    return () => {
      if (!socket) return;
      socket.emit('leave room', { roomId, userId: user.id });
      leaveRoom();
    };
  }, [socket]);

  useEffect(() => {
    if (!room) return;
    if (user.id === room.memberList?.[0].id) {
      setHost(true);
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
      <div style={{ position: 'fixed', top: '0', left: '0' }}>
        <h1>{room.roomName}</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100vw', height: '80vh' }}>
        <div style={{ order: '1', ...flexConfig  }}>
          {room.memberList.map((member, idx) => {
            if ((idx + 1) % 2) {
              return (
                <Video
                  key={idx}
                  src=''
                  id={member.id}
                  username={member.name}
                  photoUrl={member.photoUrl}
                />
              );
            }
          })}
        </div>
        <div style={{ order: '3', ...flexConfig }}>
          {room.memberList.map((member, idx) => {
            if (!((idx + 1) % 2)) {
              return (
                <Video
                  key={idx}
                  src=''
                  id={member.id}
                  username={member.name}
                  photoUrl={member.photoUrl}
                />
              );
            }
          })}
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
