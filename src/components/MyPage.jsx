import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import FriendCell from './FriendCell';
import ModalPortal from './ModalPortal';
import Modal from './Modal';
import AddFriendForm from './AddFriendForm';

function MyPage({ onLoad, onLogout, onLoadRequestList, onSubmit, onRequest, user }) {
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
    <div style={{ backgroundColor: 'lightGray' }}>
      <div>
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <Button onClick={() => onLogout(user)} text='로그아웃' />
      </div>
      <div>
        {!isRequestList && (
          <Button
            text='친구 추가하기'
            onClick={() => openModal(<AddFriendForm user={user} />)}
          />
        )}
        {isModalOpen && (
          <ModalPortal>
            <Modal setModalOpen={setModalOpen}>{modalContent}</Modal>
          </ModalPortal>
        )}
        {!isRequestList ? (
          user.friendList?.length > 0 ? (
              user.friendList.map(friend => (
                  <FriendCell
                    isRequest={false}
                    key={friend._id}
                    name={friend.name}
                    photoUrl={friend.photoUrl}
                    isOnline={friend.isOnline}
                  />
              ))
          ) : (
              <div>친구를 추가해보세요..!</div>
          )
        ) : user.friendRequestList?.length > 0 ? (
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
        ) : (
              <div>친구 요청 목록이 없습니다..</div>
        )}
      </div>
      <Button
        onClick={() => setRequestList(!isRequestList)}
        text={isRequestList ? '친구 목록 보기' : '요청 목록 보기'}
      />
    </div>
  );
}

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
