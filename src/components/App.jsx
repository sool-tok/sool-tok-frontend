import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import MyPageContainer from '../containers/MyPageContainer';
import LobbyContainer from '../containers/LobbyContainer';
import RoomContainer from '../containers/RoomContainer';
import FloatingButton from './FloatingButton';
import Login from './Login';

function App({ socket, user, onLogin, onLoad }) {
  const [isMyPageOpen, setMyPageOpen] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (!user) return setMyPageOpen(false);
  }, [user]);

  return (
    <>
      {user && isMyPageOpen && <MyPageContainer />}
      {user && <FloatingButton onClick={() => setMyPageOpen(!isMyPageOpen)} text='나' />}
      <Switch>
        <Route exact path='/'>
          {user ? <LobbyContainer /> : <Login onLogin={onLogin} />}
        </Route>
        <Route path='/rooms/:room_id'>
          {user ? <RoomContainer /> : <div>로그인해주세요..</div>}
        </Route>
        <Redirect to='/' />
      </Switch>
    </>
  );
}

export default App;

App.propTypes = {
  socket: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.object,
  ]),
  user: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.object,
  ]),
  onLogin: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
};
