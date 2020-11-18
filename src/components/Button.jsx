import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Button({ onClick, children, color }) {
  return (<StyledButton color={color} onClick={onClick}>{children}</StyledButton>);
}

const StyledButton = styled.button`
  all: unset;
  cursor: pointer;
  max-width: 100px;
  padding: 14px 16px;
  border-radius: 32px;
  font-size: 14px;
  background-color: ${props => props.color || '#ffd32a'};
  transition-property: scale, translateY;
  transition: filter 0.3s;

  &:hover {
    filter: brightness(0.7);
  }
`;

export default Button;

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  color: PropTypes.string,
};
