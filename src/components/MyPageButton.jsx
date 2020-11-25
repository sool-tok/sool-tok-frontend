import React, { useState } from 'react';

import { BiFace } from 'react-icons/bi';
import FloatingButton from './FloatingButton';

import MyPageContainer from '../containers/MyPageContainer';

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
