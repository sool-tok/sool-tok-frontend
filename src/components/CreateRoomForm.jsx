import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from './Button';

function CreateRoomForm({ onSubmit }) {
  const [inputs, setInputs] = useState({
    roomName: '',
    maxNum: '2',
  });

  const submitRoomData = ev => {
    ev.preventDefault();
    const { roomName, maxNum } = inputs;
    onSubmit({ roomName, maxNum: Number(maxNum) });
  };

  const handleInputChange = ev => {
    const { name, value } = ev.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>어서 자리 잡자!</h2>
      <h3>좌석의 최대 인원은 6명입니다.</h3>
      <form onSubmit={submitRoomData}>
        <input
          type='text'
          name='roomName'
          value={inputs.roomName}
          onChange={handleInputChange}
          required
        />
        <input
          type='number'
          name='maxNum'
          min='2'
          max='6'
          placeholder='2'
          value={inputs.maxNum}
          onChange={handleInputChange}
          required
        />
        <input type='submit' value='좌석 잡기' />
      </form>
    </div>
  );
}

export default CreateRoomForm;

CreateRoomForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
