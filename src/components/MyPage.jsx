import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from './Button';
import FriendCell from './FriendCell';
import ModalPortal from './ModalPortal';
import Modal from './Modal';
import AddFriendForm from './AddFriendForm';

import { IoMdCheckmark, IoMdClose } from 'react-icons/io';

function MyPage({ onLoad, onLogout, onLoadRequestList, onSubmit, user, friendList, friendRequestList }) {
  const [isRequestList, setRequestList] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setmodalContent] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    onLoad(user);
  }, []);

  useEffect(() => {
    if (!friendList) return;
    setList(friendList);
  }, [friendList]);

  useEffect(() => {
    if (!friendRequestList) return;
    setList(friendRequestList);
  }, [friendRequestList]);

  useEffect(() => {
    if (isRequestList) {
      onLoadRequestList(user);
    } else {
      onLoad(user);
    }
  }, [isRequestList]);


  const openModal = element => {
    setModalOpen(true);
    setmodalContent(element);
  };

  return (
    <Container>
      {isModalOpen &&
        <ModalPortal>
          <Modal setModalOpen={setModalOpen}>{modalContent}</Modal>
        </ModalPortal>
      }
      <MyInfo>
        <MyInfoWrapper>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </MyInfoWrapper>
        <Button onClick={() => onLogout(user)}>로그아웃</Button>
      </MyInfo>
      <FriendList>
        {!isRequestList &&
          <Button onClick={() => openModal(<AddFriendForm user={user} />)}>
            친구 추가하기
          </Button>
        }
        {
          list.length > 0 ?
            list.map(member => (
              <FriendCell
                key={member._id}
                name={member.name}
                photoUrl={member.photoUrl}
                isOnline={member.isOnline}
              >
                {
                  isRequestList &&
                  <RequestContolBox>
                    <Button
                      onClick={() => onSubmit(user._id, true, member._id)}
                      color='#20bf6b'
                    >
                      <IoMdCheckmark size={20} />
                    </Button>
                    <Button
                      onClick={() => onSubmit(user._id, false, member._id)}
                      color='#eb3b5a'
                    >
                      <IoMdClose size={20} />
                    </Button>
                  </RequestContolBox>
                }
              </FriendCell>
            ))
          :
            <div>
              {
                !isRequestList ?
                  '친구를 추가해보세요..!☀️'
                :
                  '친구 요청 목록이 없습니다..🥲'
              }
            </div>
        }
      </FriendList>
      <ListToggle onClick={() => setRequestList(!isRequestList)}>
        {isRequestList ? '친구 목록 보기' : '요청 목록 보기'}
      </ListToggle>
    </Container>
  );
}

const Container = styled.div`
  z-index: 998;
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 300px;
  height: 600px;
  background-color: #330057;
  border-radius: 24px;
  overflow: hidden;
  animation: slideUp 0.6s ease-in-out forwards;

  @keyframes slideUp {
    from {
      transform: translateY(8px);
      opacity: 0;
    }

    to {
      transform: translateY(-2px);
      opacity: 1;
    }
  }
`;

const MyInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 18px;
  margin-bottom: 20px;
`;

const MyInfoWrapper = styled.div`
  color: white;

  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
  }
`;

const FriendList = styled.div`
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

const ListToggle = styled.a`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  height: 64px;
  background-color: #ffd32a;

  &:hover {
    background-color: #b8961d;
  }
`;

export default MyPage;

MyPage.propTypes = {
  onLoad: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLoadRequestList: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.object,
  ]),
  friendList: PropTypes.array,
  friendRequestList: PropTypes.array,
};
