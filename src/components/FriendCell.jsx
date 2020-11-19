import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function FriendCell({ name, photoUrl, isOnline, children }) {
  return (
    <StyledFriendCell style={{ backgroundColor: isOnline ? '#1abc9c' : '#130f40' }}>
      <img src={photoUrl} />
      <p>{name}</p>
      {children}
    </StyledFriendCell>
  );
}

const StyledFriendCell = styled.div`
  position: relative;
  width: 240px;
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
    width: 106px;
  }
`;

export default FriendCell;

FriendCell.propTypes = {
  name: PropTypes.string.isRequired,
  photoUrl: PropTypes.string.isRequired,
  isOnline: PropTypes.bool.isRequired,
  children: PropTypes.node,
};
