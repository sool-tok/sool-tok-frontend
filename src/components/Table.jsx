import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Table({ roomPath, roomName, memberList }) {
  return (
    <Link to={`/rooms/${roomPath}`}>
      <Wrapper>
        <div />
        <div />
        <div className='member'>{memberList[0]?.name}</div>
        <div />
        <div />
        <div className='table'>{roomName.slice(0, 10)}</div>
        <div />
        <div />
        <div className='member'>{memberList[1]?.name}</div>
        <div className='member'>{memberList[2]?.name}</div>
        <div />
        <div />
        <div />
        <div />
        <div className='member'>{memberList[3]?.name}</div>
        <div />
        <div />
      </Wrapper>
    </Link>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-template-areas:
    '. . . . .'
    '. t t t .'
    '. t t t .'
    '. t t t .'
    '. . . . .';
  width: 240px;
  height: 240px;
  margin: 20px;
  color: #ffd32a;
  animation: table-spin infinite 2s linear;

  @keyframes table-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .table {
    grid-area: t;
    background-color: rgba(238, 238, 238, 0.3);
    border-radius: 50%;
    padding: 20px;
    font-size: 20px;
    overflow: hidden;
    animation: heart-beat infinite 0.5s linear;

    @keyframes heart-beat {
      0% {
        transform: scale(0.8);
      }
      50% {
        transform: scale(1);
      }
      100% {
        transform: scale(0.8);
      }
    }
  }

  .table,
  .member {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .member {
    font-size: 18px;
  }
`;

export default Table;

Table.propTypes = {
  roomPath: PropTypes.string,
  roomName: PropTypes.string,
  memberList: PropTypes.array,
};
