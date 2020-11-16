import React, { useState } from 'react';
import PropTypes from 'prop-types';

function JoinRoomForm({ onSubmit }) {
  const [input, setInput] = useState('');

  const submitRoomData = ev => {
    ev.preventDefault();
    onSubmit(input.split('/rooms/')[1]);
  };

  const handleInputChange = ev => {
    const { value } = ev.target;
    setInput(value);
  };

  return (
    <div style={{ backgroundColor: 'white' }}>
      <h2>Title : 친구한테 가자!</h2>
      <form onSubmit={submitRoomData}>
        <label htmlFor='roomUrl'>
          Description: 공유 받은 URL 을 입력하세요
        </label>
        <input
          type='url'
          name='roomUrl'
          id='roomUrl'
          required
          placeholder='http://localhost:3000/rooms/'
          pattern='http://localhost:3000/rooms/.*'
          title='The URL must be in a Sool-tok domain.'
          value={input}
          size='36'
          max='36'
          onChange={handleInputChange}
        />
        <input type='submit' value='합석하기' />
      </form>
    </div>
  );
}

export default JoinRoomForm;

JoinRoomForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
