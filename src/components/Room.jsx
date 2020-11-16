import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import Button from './Button';

import FloatingButton from './FloatingButton';
import ChatContainer from '../containers/ChatContainer';

function Room({ user, socket, room, joinRoom, leaveRoom, updateMember }) {
  const { room_id: roomId } = useParams();
  const history = useHistory();
  const [isOpenedChatRoom, setOpenChatRoom] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join room', { roomId, user }, ({ room }) => {
      // if (!room) no room Error Handling
      joinRoom(room);
    });

    socket.on('update room', ({ memberList }) => {
      updateMember(memberList);
    });
  }, [socket]);

  useEffect(() => {
    return () => {
      socket.emit('leave room', { roomId, userId: user.id });
      leaveRoom();
    };
  }, []);

  return (
    <div>
      <h1>Room</h1>
      {room && (
        <>
          <p>{room.id}</p>
          <p>{room.roomName}</p>
          <p>{room.maxNum}</p>
          {room.memberList.map(member => (
            <p key={member.id}>{member.name}</p>
          ))}
          <Button text='방나가기' onClick={() => history.push('/')} />
          <FloatingButton text='채팅하기' onClick={() => setOpenChatRoom(!isOpenedChatRoom)} />
          {isOpenedChatRoom && <ChatContainer />}
        </>
      )}
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
