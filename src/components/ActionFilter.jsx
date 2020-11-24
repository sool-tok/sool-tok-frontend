import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { filterSocket } from '../utils/socket';

function ActionFilter({ roomId, isFilterOn, setIsFilterOn }) {
  const emojiList = ['🤮', '🍺', '❤️', '🤔'];

  const filterOn = ev => {
    const { value } = ev.target;

    setIsFilterOn(true);
    filterSocket.renderFilter({ roomId, isFilterOn: true, emoji: value });
  };

  const filterOff = () => {
    setIsFilterOn(false);
    filterSocket.renderFilter({ roomId, isFilterOn: false, emoji: '' });
  };

  return (
    <ActionIconBox>
    {isFilterOn ?
      <ActionIconButton onClick={filterOff}>❌</ActionIconButton>
      :
      <>
        {emojiList.map((emoji, i) => (
          <ActionIconButton key={i} onClick={filterOn} value={emoji}>{emoji}</ActionIconButton>
        ))}
      </>
    }
    </ActionIconBox>
  );
}

const ActionIconBox = styled.div`
  width: 240px;
  height: 60px;
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: #330057;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ActionIconButton = styled.button`
  font-size: 25px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
`;

export default ActionFilter;

ActionFilter.propTypes = {
  roomId: PropTypes.string.isRequired,
  isFilterOn: PropTypes.bool.isRequired,
  setIsFilterOn: PropTypes.func.isRequired,
};
