import React from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';

function Loading() {
  return (
    <Wrapper>
      <ReactLoading type='cylon' color='#ffd32a' width={'20%'} height={'20%'} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Loading;
