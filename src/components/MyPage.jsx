import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactLoading from 'react-loading';

import Button from './Button';
import ModalPortal from './ModalPortal';
import Modal from './Modal';
import FriendList from './FriendList';

import theme from './styles/theme';

function MyPage({
  loading,
  error,
  user,
  friendList,
  friendRequestList,
  addFriendList,
  addFriendRequestList,
  logoutUser,
  onSubmit,
}) {
  const [isRequestList, setRequestList] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setmodalContent] = useState(null);

  useEffect(() => {
    addFriendList(user._id);
  }, []);

  const toggleFriendList = ev => {
    if (isRequestList) {
      addFriendList(user._id);
      setRequestList(false);
    } else {
      addFriendRequestList(user._id);
      setRequestList(true);
    }
  };

  const openModal = element => {
    setModalOpen(true);
    setmodalContent(element);
  };

  return (
    <Container>
      {isModalOpen && (
        <ModalPortal>
          <Modal setModalOpen={setModalOpen}>{modalContent}</Modal>
        </ModalPortal>
      )}
      <MyInfo>
        <MyInfoWrapper>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </MyInfoWrapper>
        <Button
          onClick={() => logoutUser(user._id)}
          color={theme.lightGray}
        >
          로그아웃
        </Button>
      </MyInfo>
      {loading ? (
        <ReactLoading
          type='bubbles'
          width={'100%'}
          height={'100%'}
          color={theme.orange}
        />
      ) : (
        <FriendList
          user={user}
          list={!isRequestList ? friendList : friendRequestList}
          isRequestList={isRequestList}
          openModal={openModal}
          onSubmit={onSubmit}
        />
      )}
      <ListToggle onClick={toggleFriendList}>
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
  border-radius: 24px;
  overflow: hidden;
  animation: slideUp 0.6s ease-in-out forwards;
  background-color: ${({ theme }) => theme.darkPurple};

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
  color: ${({ theme }) => theme.orange};

  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
  }
`;

const ListToggle = styled.a`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  color: ${({ theme }) => theme.purple};
  background-color: ${({ theme }) => theme.orange};

  &:hover {
    filter: brightness(0.7);
  }
`;

export default MyPage;

MyPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  user: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  friendList: PropTypes.array,
  friendRequestList: PropTypes.array,
  addFriendList: PropTypes.func.isRequired,
  addFriendRequestList: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};
