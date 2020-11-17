import React, { useState } from 'react';
import PropTypes from 'prop-types';

function AddFriendForm({ onSubmit }) {
  const [input, setInput] = useState('');

  const submitRoomData = ev => {
    ev.preventDefault();

    // Email validation
    onSubmit(input);
  };

  const handleInputChange = ev => {
    const { value } = ev.target;
    setInput(value);
  };

  return (
    <div>
      <h2>친구 요청</h2>
      <form onSubmit={submitRoomData}>
        <input
          type='email'
          name='email'
          value={input}
          onChange={handleInputChange}
          required
        />
        <input type='submit' value='친구 요청' />
      </form>
    </div>
  );
}

export default AddFriendForm;

AddFriendForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
