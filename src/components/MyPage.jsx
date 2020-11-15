import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import FriendCell from './FriendCell';

function MyPage({ onLoad, onLogout, onSubmit, user }) {
  const [isRequestList, setRequestList] = useState(false);

  // FOR TEST
  user.friendRequestList = [{ id: '1asdad', name: '김도희', photoUrl: 'https://avatars3.githubusercontent.com/u/60248910?s=400&u=d906c83a0156628a86a758b717b50a2c2b417046&v=4', isOnline: true }];

  useEffect(() => {
    onLoad(user);
  }, []);

  useEffect(() => {
    console.log('리스트 새로 받아옴');
  }, [isRequestList]);

  return (
    <div style={{ backgroundColor: 'lightGray' }}>
      <div>
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <Button onClick={() => { onLogout(user); }} text='로그아웃' />
      </div>
      <div>
        { !isRequestList && <Button onClick={() => {}} text='친구 요청하기' /> }
        {
          !isRequestList ?
            user.friendList?.length > 0 ?
              user.friendList.map(friend => {
                return (
                  <FriendCell
                    isRequest={false}
                    key={friend.id}
                    name={friend.name}
                    photoUrl={friend.photoUrl}
                    isOnline={friend.isOnline}
                  />
                );
              })
            :
              <div>친구를 추가해보세요..!</div>
          :
            user.friendRequestList?.length > 0 ?
              user.friendRequestList.map(request => {
                return (
                  <FriendCell
                    isRequest={true}
                    key={request.id}
                    name={request.name}
                    email={request.email}
                    photoUrl={request.photoUrl}
                    isOnline={request.isOnline}
                    onSubmit={onSubmit}
                  />
                );
              })
            :
              <div>친구 요청 목록이 없습니다..</div>
        }
      </div>
      <Button
        onClick={() => { setRequestList(!isRequestList); }}
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
  user: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.object,
  ]),
};
