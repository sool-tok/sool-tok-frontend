import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { userService } from '../utils/api';

function AddFriendForm({ setModalOpen, user }) {
  const [input, setInput] = useState('');
  const [requestResult, setRequestResult] = useState('');

  const submitRoomData = async ev => {
    ev.preventDefault();

    try {
      const { message } = await userService.requestFriend(user._id, input);

      toast(message, { type: toast.TYPE.DARK });
      setModalOpen(false);
    } catch (err) {
      setRequestResult(err);
      setInput('');
    }
  };

  const handleInputChange = ev => {
    const { value } = ev.target;
    setInput(value);
  };

  return (
    <div>
      <h2>친구 요청</h2>
      {requestResult && <div>{requestResult}</div>}
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
  user: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};
