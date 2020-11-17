import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';

function Modal({ children, setModalOpen }) {
  const tempStyle = {
    background:'rgba(0, 0, 0, 0.25)',
    position: 'fixed',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={tempStyle}>
      <Button onClick={() => setModalOpen(false)} text='모달닫기' />
      {children}
    </div>
  );
}

export default Modal;

Modal.propTypes = {
  children: PropTypes.node,
  setModalOpen: PropTypes.func.isRequired,
};
