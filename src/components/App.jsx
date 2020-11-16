import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import MyPageContainer from '../containers/MyPageContainer';
import LobbyContainer from '../containers/LobbyContainer';
import RoomContainer from '../containers/RoomContainer';
import FloatingButton from './FloatingButton';
import Login from './Login';

function App({ socket, user, onLogin, onLoad }) {
  const [isOpenedMyPage, setOpenMyPage] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (!user) {
      setOpenMyPage(false);
    } else {
      socket.emit('new user', { userId: user._id });
    }
  }, [user]);

  return (
    <>
      {user && isOpenedMyPage && <MyPageContainer />}
      {user && (
        <FloatingButton
          onClick={() => {
            setOpenMyPage(!isOpenedMyPage);
          }}
          text='나'
        />
      )}
      <Switch>
        <Route exact path='/'>
          {user ? <LobbyContainer /> : <Login onLogin={onLogin} />}
        </Route>
        <Route path='/rooms/:room_id'>{user && <RoomContainer />}</Route>
        <Redirect to='/' />
      </Switch>
    </>
  );
}

export default App;

App.propTypes = {
  socket: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  user: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  onLogin: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
};
