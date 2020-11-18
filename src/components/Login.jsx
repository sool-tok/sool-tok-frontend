import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from './Button';

function Login({ onLogin }) {
  return (
    <Container>
      <div>
        <h1>술톡</h1>
        <p>친구와 함께하는 술술TALK🍺</p>
        <Button onClick={onLogin}>구글 로그인</Button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #330057;

  div {
    width: 380px;
    height: 480px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 42px;
    background-color: #49007d;
  }

  h1 {
    font-size: 48px;
    margin-bottom: 30px;
    color: #f7d794;
    text-align: center;
  }

  p {
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 50px;
    color: #f7d794;
  }
`;

export default Login;

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
