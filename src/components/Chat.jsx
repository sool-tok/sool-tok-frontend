import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Chat({ addMessage, author, message, socket }) {
  const [chatMessage, setChatMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const submitMessage = ev => {
    ev.preventDefault();
    setChatMessage(chatMessage);
  };

  //       text => addMessage({
  //   id: user._id,
  // });

  const handleInputChange = ev => {
    const { value } = ev.target;
    setChatMessage(value);
    addMessage(value);
  };

  return (
    <div style={{ backgroundColor: 'powderblue' }}>
      <div>Message</div>
      {chatMessage && <p>{chatMessage}</p>}
      <form onSubmit={submitMessage}>
        <section id='messages-list'>
          <ul>
            {messageList.map(message => (
              <div key={message.id} {...message}></div>
            ))}
          </ul>
        </section>
        <section id='new-message'>
          <input
            onChange={handleInputChange}
            type='text'
            name='message'
            value={chatMessage}
          />
        </section>
        <input type='submit' value='SEND' />
      </form>
    </div>
  );
}

export default Chat;

Chat.propTypes = {
  author: PropTypes.string,
  message: PropTypes.string,
  socket: PropTypes.object,
  addMessage: PropTypes.func.isRequired,
};
