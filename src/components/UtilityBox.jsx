import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import theme from './styles/theme';
import { IoIosExit } from 'react-icons/io';
import { BsLockFill, BsUnlockFill } from 'react-icons/bs';
import { FaVideo, FaVideoSlash, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

import { roomSocket } from '../utils/socket';
import { controlAudioOption, controlVideoOption } from '../utils/stream';

import Button from './Button';

function UtilityBox({ room }) {
  const history = useHistory();
  const [streamOptions, setStreamOptions] = useState({ audio: true, video: true });

  const handleLockingRoom = useCallback(() => {
    roomSocket.updateRoomLockingStatus({
      roomId: room._id,
      isLocked: !room.isLocked,
    });
  }, [room]);

  const handleAudioTrack = useCallback(() => {
    if (streamOptions.audio) {
      controlAudioOption.off();
      setStreamOptions(prev => ({ ...prev, audio: false }));
    } else {
      controlAudioOption.on();
      setStreamOptions(prev => ({ ...prev, audio: true }));
    }
  }, [streamOptions]);

  const handleVideoTrack = useCallback(() => {
    if (streamOptions.video) {
      controlVideoOption.off();
      setStreamOptions(prev => ({ ...prev, video: false }));
    } else {
      controlVideoOption.on();
      setStreamOptions(prev => ({ ...prev, video: true }));
    }
  }, [streamOptions]);

  return (
    <Wrapper>
      <div>
        {room.isHost && (
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
          {streamOptions.audio ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
        </Button>
        <Button
          color={streamOptions.video ? theme.green : theme.lightGray}
          onClick={handleVideoTrack}>
          {streamOptions.video ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
        </Button>
        <IoIosExit
          onClick={() => history.push('/')}
          size={42}
          cursor='pointer'
          color={theme.red}
        />
      </div>
    </Wrapper>
  );
}

export default UtilityBox;

const Wrapper = styled.div`
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
    background-color: ${({ theme }) => theme.darkPurple};
  }

  button:not(:last-child) {
    margin-right: 16px;
  }
`;

UtilityBox.propTypes = {
  room: PropTypes.object.isRequired,
};
