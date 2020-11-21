import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AddFriendForm from './AddFriendForm';
import Button from './Button';
import FriendCell from './FriendCell';

import { IoMdCheckmark, IoMdClose } from 'react-icons/io';

function FriendList({ user, list, isRequestList, openModal, onSubmit }) {
  console.log('📌 : FriendList -> isRequestList', isRequestList);
  console.log('📌 : FriendList -> list', list);

  return (
    <Wrapper>
      {!isRequestList && (
        <Button onClick={() => openModal(<AddFriendForm user={user} />)}>
          친구 추가하기
        </Button>
      )}
      {list?.length ? (
        list.map(member => (
          <FriendCell
            key={member._id}
            name={member.name}
            photoUrl={member.photoUrl}
            isOnline={member.isOnline}>
            {isRequestList && (
              <RequestContolBox>
                <Button
                  onClick={() => onSubmit(user._id, true, member._id)}
                  color='#20bf6b'>
                  <IoMdCheckmark size={20} />
                </Button>
                <Button
                  onClick={() => onSubmit(user._id, false, member._id)}
                  color='#eb3b5a'>
                  <IoMdClose size={20} />
                </Button>
              </RequestContolBox>
            )}
          </FriendCell>
        ))
      ) : (
        <div>
          {!isRequestList
            ? '친구를 추가해보세요..!☀️'
            : '친구 요청 목록이 없습니다..🥲'}
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  color: #fff;
  width: inherit;
  height: 440px;

  &::-webkit-scrollbar {
    display: none;
  }

  button {
    margin-bottom: 12px;
    color: black;
  }
`;

const RequestContolBox = styled.div`
  position: absolute;
  right: 10px;
  display: flex;

  button {
    margin: 0;
    padding: 4px;
    width: 20px;
    height: 20px;
  }
  button:nth-child(1) {
    margin-right: 8px;
  }
`;

export default FriendList;

FriendList.propTypes = {
  user: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  list: PropTypes.array,
  isRequestList: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
