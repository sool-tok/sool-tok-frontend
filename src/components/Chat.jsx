import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import format from 'date-fns/format';

// TODO: chatList.map key unique 한걸로 설정해주기.
function Chat({ user, chatList, onSubmit }) {
  const [input, setInput] = useState('');
  const messageRef = useRef();

  useEffect(() => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight;
  }, [chatList]);

  const handleInputChange = ev => {
    const { value } = ev.target;

    setInput(value);
  };

  const handleMessageSubmit = ev => {
    ev.preventDefault();

    const time = format(new Date(), 'HH:mm');
    const newChat = {
      author: user.name,
      photoUrl: user.photoUrl,
      content: input,
      date: time,
      id: user._id,
    };

    onSubmit(newChat);
    setInput('');
  };

  const checkMyMessage = id => {
    return id === user._id ? 'my-message' : 'friend-message';
  };

  return (
    <Wrapper>
      <MessageList ref={messageRef}>
        {chatList &&
          chatList.map((chat, i) => (
            <ChatCell key={i} className={checkMyMessage(chat.id)}>
              <Profile>
                <img src={chat.photoUrl} />
                <div>{chat.author}</div>
              </Profile>
              <span>{chat.content}</span>
              <span>{chat.date}</span>
            </ChatCell>
          ))
        }
      </MessageList>
      <MessageForm onSubmit={handleMessageSubmit}>
        <input
          onChange={handleInputChange}
          type='text'
          name='message'
          value={input}
        />
        <input type='submit' value='SEND' />
      </MessageForm>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: #330057;
  width: 400px;
  height: 400px;
  position: fixed;
  right: 100px;
  bottom: 94px;
  border-radius: 24px;
  overflow: hidden;
`;

const MessageList = styled.div`
  width: 100%;
  height: 340px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MessageForm = styled.form`
  background-color: blue;
  width: 100%;
  height: 60px;
  display: flex;

  input {
    all: unset;
  }

  input[type='text'] {
    width: 70%;
    padding: 0px 20px;
    background-color: #eee;
  }

  input[type='submit'] {
    cursor: pointer;
    width: 30%;
    text-align: center;
    background-color: #ffd32a;
  }
`;

const ChatCell = styled.div`
  min-width: 280px;
  max-width: 340px;
  display: flex;
  align-items: flex-start;
  padding: 10px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 24px;
    margin-bottom: 6px;
  }

  span:nth-child(2) {
    background-color: #ffd32a;
    padding: 10px;
    margin-right: 6px;
    border-radius: 20px;
  }

  span:nth-child(3) {
    font-size: 12px;
    color: gray;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3px 10px;
  color: #fff;
  font-size: 14px;
`;

export default Chat;

Chat.propTypes = {
  user: PropTypes.object,
  chatList: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
};
