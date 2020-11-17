import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function FloatingButton({ onClick, text }) {
  return (<StyledFloatingButton onClick={onClick}>{text}</StyledFloatingButton>);
}

const StyledFloatingButton = styled.button`
  all: unset;
  z-index: 999;
  cursor: pointer;
  padding: 21px;
  border-radius: 48px;
  position: fixed;
  right: 24px;
  bottom: 24px;
  font-size: 18px;
  background-color: #ff5252;
  color: #fff;
  transition: background-color 0.3s;
  transition: 0.6s;

  &:hover {
    background-color: #b33939;
    transform: translateY(-5px);
  }
`;

export default FloatingButton;

FloatingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
