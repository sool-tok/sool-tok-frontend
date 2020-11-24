import React, { useState } from 'react';

import MyPageContainer from '../containers/MyPageContainer';
import FloatingButton from './FloatingButton';

import { BiFace } from 'react-icons/bi';

function MyPageButton() {
  const [isMyPageOpen, setMyPageOpen] = useState(false);

  return (
    <div>
      {isMyPageOpen && <MyPageContainer />}
      <FloatingButton onClick={() => setMyPageOpen(!isMyPageOpen)}>
        <BiFace />
      </FloatingButton>
    </div>
  );
}

export default MyPageButton;
