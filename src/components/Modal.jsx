import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from './Button';

function Modal({ children, closeModal }) {
  return (
    <StyledModal>
      {children}
      <Button color='gray' onClick={closeModal} text='닫기' />
    </StyledModal>
  );
}

const StyledModal = styled.div`
  z-index: 998;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  div {
    width: 400px;
    height: 260px;
    padding: 18px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #07b578;
    border-radius: 38px;
  }

  form {
    text-align: center;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 18px;
    color: black;
  }

  h3 {
    font-size: 16px;
    margin-bottom: 32px;
    color: black;
  }

  input[type='text'],
  input[type='number'],
  input[type='url'],
  input[type='email'] {
    all: unset;
    color: black;
    background-color: #fff;
    padding: 14px;
    border-radius: 24px;
    margin-right: 10px;
  }

  input[type='url'] {
    width: 200px;
  }

  input[type='submit'] {
    all: unset;
    cursor: pointer;
    padding: 14px 16px;
    border-radius: 32px;
    font-size: 14px;
    background-color: #ffd32a;
  }
`;

export default Modal;

Modal.propTypes = {
  children: PropTypes.node,
  closeModal: PropTypes.func.isRequired,
};
