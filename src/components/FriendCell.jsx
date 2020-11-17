import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from './Button';

function FriendCell({ onSubmit, name, photoUrl, isOnline, isRequest, requestId, userId }) {
  return (
    <StyledFriendCell style={{ backgroundColor: isOnline ? '#1abc9c' : '#130f40' }}>
      <img src={photoUrl} />
      <p>{name}</p>
      {
        isRequest &&
        <div style={{ backgroundColor: 'lightpink' }}>
          <Button onClick={() => onSubmit(userId, true, requestId)} text='수락' />
          <Button onClick={() => onSubmit(userId, false, requestId)} text='거절' />
        </div>
      }
    </StyledFriendCell>
  );
}

const StyledFriendCell = styled.div`
  width: 220px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #474787;
  border-radius: 48px;
  margin: 10px;
  padding: 10px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 35px;
    margin-right: 14px;
  }

  p {
    font-size: 18px;
    color: #fff;
  }
`;

export default FriendCell;

FriendCell.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  photoUrl: PropTypes.string.isRequired,
  isOnline: PropTypes.bool.isRequired,
  isRequest: PropTypes.bool.isRequired,
  requestId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
