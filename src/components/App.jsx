import React, { useEffect, useState, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { delay } from '../utils/delay';

import MyPageContainer from '../containers/MyPageContainer';

import Lobby from './Lobby';
import Login from './Login';
import ErrorBox from './ErrorBox';
import FloatingButton from './FloatingButton';

import theme from './styles/theme';
import GlobalStyle from './styles/globalStyle';
import { BiFace } from 'react-icons/bi';
import ReactLoading from 'react-loading';

const RoomContainer = lazy(async () => {
  await delay(1600);
  return import('../containers/RoomContainer');
});

function App({ loading, user, loginUserWithToken, loginUserWithGoogle }) {
  const [isMyPageOpen, setMyPageOpen] = useState(false);

  useEffect(() => {
    loginUserWithToken();
  }, []);

  useEffect(() => {
    if (!user) return setMyPageOpen(false);
  }, [user]);

  if (loading && !user) {
    return (
      <ReactLoading
        type='bubbles'
        color='#ffd32a'
        width={'100%'}
        height={'100%'}
      />
    );
  }

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
          {user ? <Lobby /> : <Login onLogin={loginUserWithGoogle} />}
        </Route>
        <Route path='/rooms/:room_id'>
          {user ? (
            <Wrapper>
              <Suspense
                fallback={
                  <ReactLoading
                    type='bubbles'
                    color='#ffd32a'
                    width={'8%'}
                    height={'8%'}
                  />
                }>
                <RoomContainer />
              </Suspense>
            </Wrapper>
          ) : (
            <ErrorBox message='로그인 해주세요..' text='로그인 화면으로' />
          )}
        </Route>
        <Redirect to='/' />
      </Switch>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  loginUserWithToken: PropTypes.func.isRequired,
  loginUserWithGoogle: PropTypes.func.isRequired,
};
