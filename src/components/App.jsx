import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';

import MyPageContainer from '../containers/MyPageContainer';
import RoomContainer from '../containers/RoomContainer';

import Lobby from './Lobby';
import Login from './Login';
import FloatingButton from './FloatingButton';

import theme from './styles/theme';
import GlobalStyle from './styles/globalStyle';
import { BiFace } from 'react-icons/bi';
import ErrorBox from './ErrorBox';

function App({ user, onLogin, onLoad }) {
  const [isMyPageOpen, setMyPageOpen] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (!user) return setMyPageOpen(false);
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <Reset />
      <GlobalStyle />
      {user && isMyPageOpen && <MyPageContainer />}
      {user && (
        <FloatingButton onClick={() => setMyPageOpen(!isMyPageOpen)}>
          <BiFace />
        </FloatingButton>
      )}
      <Switch>
        <Route exact path='/'>
          {user ? <Lobby /> : <Login onLogin={onLogin} />}
        </Route>
        <Route path='/rooms/:room_id'>
          {user ? <RoomContainer /> : <ErrorBox message='로그인 해주세요..' text='로그인 화면으로' />}
        </Route>
        <Redirect to='/' />
      </Switch>
    </ThemeProvider>
  );
}

export default App;

App.propTypes = {
  user: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  onLogin: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
};
