import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from './Button';
import FriendCell from './FriendCell';
import ModalPortal from './ModalPortal';
import Modal from './Modal';
import AddFriendForm from './AddFriendForm';

function MyPage({ onLoad, onLogout, onLoadRequestList, onSubmit, user }) {
  const [isRequestList, setRequestList] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setmodalContent] = useState(null);

  useEffect(() => {
    onLoad(user);
  }, []);

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
        {isModalOpen && (
          <ModalPortal>
            <Modal setModalOpen={setModalOpen}>{modalContent}</Modal>
          </ModalPortal>
        )}
        {!isRequestList ?
          user.friendList?.length > 0 ?
              user.friendList.map(friend => (
                <FriendCell
                  isRequest={false}
                  key={friend._id}
                  name={friend.name}
                  photoUrl={friend.photoUrl}
                  isOnline={friend.isOnline}
                />
              ))
            :
              <div>친구를 추가해보세요..!</div>
          : user.friendRequestList?.length > 0 ?
              user.friendRequestList.map(request => (
                <FriendCell
                  isRequest={true}
                  key={request._id}
                  name={request.name}
                  photoUrl={request.photoUrl}
                  isOnline={request.isOnline}
                  onSubmit={onSubmit}
                  requestId={request._id}
                  userId={user._id}
                />
              ))
            :
              <div>친구 요청 목록이 없습니다..</div>
        }
      </FriendList>
      <ToggleWrapper>
        <Button onClick={() => setRequestList(!isRequestList)} >
          {isRequestList ? '친구 목록 보기' : '요청 목록 보기'}
        </Button>
      </ToggleWrapper>
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
  color: #fff;

  button {
    margin-bottom: 12px;
    color: black;
  }
`;

const ToggleWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffd32a;
  border-radius: 24px;

  &:hover {
    background-color: #b8961d;
  }

  button {
    all: unset;
  }
`;

export default MyPage;

MyPage.propTypes = {
  onLoad: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLoadRequestList: PropTypes.func.isRequired,
  onRequest: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.object,
  ]),
};
