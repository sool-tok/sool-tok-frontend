import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { userService } from '../utils/api';

function AddFriendForm({ user }) {
  const [input, setInput] = useState('');
  const [requestResult, setRequestResult] = useState('');

  const submitRoomData = async ev => {
    ev.preventDefault();

    // Email validation
    const token = localStorage.getItem('jwt-token');
    const { message } = await userService.requestFriend(user._id, token, input);
    setRequestResult(message);
  };

  const handleInputChange = ev => {
    const { value } = ev.target;
    setInput(value);
  };

  return (
    <div style={{ backgroundColor: 'white' }}>
      <h2>Form</h2>
      {requestResult && <div>{requestResult}</div>}
      <form onSubmit={submitRoomData}>
        <input
          type='email'
          name='email'
          value={input}
          onChange={handleInputChange}
          required
        />
        <input type='submit' value='친구 추가' />
      </form>
    </div>
  );
}

export default AddFriendForm;

AddFriendForm.propTypes = {
  user: PropTypes.object.isRequired,
};
