import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { gameSocket, getMySocketId } from '../utils/socket';

function SpeechGame({ roomId, isMyTurn, setMyTurn }) {
  const [gameData, setGameData] = useState(null);
  const gameDataRef = useRef();
  const isMyTurnRef = useRef();

  const timeout = useRef();
  const recognition = useRef();

  const [phrase, setPhrase] = useState('');
  const [notification, setNotification] = useState('');
  const [script, setScript] = useState('');

  /*
    {
      timout: 60000,
      orderList: ['asdasd', 'ascac', 'avs', 'sadsd'],
      phrases: ['추워', '기분 좋아', '소켓 연결'],
      currentTurn: '2',
    }
  */

  useEffect(() => {
    console.log('턴 변경', isMyTurn);
  }, [isMyTurn]);

  useEffect(() => {
    console.log('게임 데이터', gameData);
  }, [gameData]);

  useEffect(() => {
    console.log('소켓 커넥터', gameData);
    if (gameData) return;

    gameSocket.listenInitailizingGame(data => {
      console.log('startGame -> data', data);

      const { orderList, currentTurn } = data;
      const mySocketId = getMySocketId();
      const isMyTurn = orderList.findIndex(({ socketId }) => socketId === mySocketId) === currentTurn;

      console.log('currentTurn', currentTurn);
      console.log('최초 턴', isMyTurn);

      gameDataRef.current = data;
      isMyTurnRef.current = isMyTurn;

      setGameData(data);
      setMyTurn(isMyTurn);
    });

    gameSocket.listenTurnChange(targetIndex => {
      const mySocketId = getMySocketId();

      const isMyTurn = gameDataRef.current.orderList[targetIndex].socketId === mySocketId;

      isMyTurnRef.current = isMyTurn;
      setMyTurn(isMyTurn);
    });
  }, [gameData]);

  useEffect(() => {
    if (!gameData) return;

    console.log('내 상태는?:', isMyTurnRef.current);

    if (!timeout.current) {
      timeout.current = setTimeout(() => {
        if (isMyTurnRef.current) {
          console.log('게임 종료: 내가 걸렸다..');
          setScript('게임 종료: 내가 걸렸다..');
        } else {
          console.log('게임 종료: 난 걸리지 않았다..');
          setScript('게임 종료: 난 걸리지 않았다..');
        }

        if (recognition.current) {
          recognition.current.stop();
          recognition.current = null;
        }

        setGameData(null);
        timeout.current = null;
        gameDataRef.current = null;

      }, gameData.explostionTime);
    }
  }, [gameData, isMyTurn]);

  useEffect(() => {
    if (!gameData) return;

    if (!isMyTurn) {
      console.log('호호 내 차례가 아니야...');
      gameSocket.listenProceedGame(data => {
        const { targetPhrase, notification, script } = data;

        if (notification) setNotification(notification);
        if (targetPhrase) setPhrase(targetPhrase);
        if (script) setScript(script);
      });
    } else {
      console.log('내 차례다...');
      setScript('');
      setPhrase('');
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

      const randomPhrase = () => {
        const number = Math.floor(Math.random() * gameData.phrases.length);
        return number;
      };

      const targetPhrase = gameData.phrases[randomPhrase()];

      gameSocket.sendGameStatus({
        roomId,
        targetPhrase,
        notification,
      });

      const startRecongnition = () => {
        setPhrase(targetPhrase);
        setNotification('두구두구두구두구두구두구');

        recognition.current = new SpeechRecognition();
        const speechRecognitionList = new SpeechGrammarList();
        const grammar = `#JSGF V1.0; grammar phrase; public <phrase> = ${phrase};`;

        speechRecognitionList.addFromString(grammar, 1);

        recognition.current.grammars = speechRecognitionList;
        recognition.current.lang = 'ko';
        recognition.current.interimResults = true;
        recognition.current.maxAlternatives = 1;

        const restartSpeech = () => {
          if (!recognition.current) return;
          recognition.current.stop();
          recognition.current.start();
        };

        const getSpeechResult = _.debounce((result = '') => {
          if (!gameDataRef.current) return;

          if (result.split(' ').join('') === targetPhrase.split(' ').join('')) {
            gameSocket.sendGameStatus({
              roomId,
              notification: '정답입니다.',
            });

            setNotification('정답입니다.');

            const currentIndex = gameDataRef.current.orderList.findIndex(({ socketId }) => socketId === getMySocketId());
            let targetIndex = currentIndex + 1;

            if (targetIndex >= gameDataRef.current.orderList.length) {
              targetIndex = 0;
            }

            gameSocket.sendNextTurn({ roomId, targetIndex });
          } else {
            console.log('실패하는데?');
            setNotification('다시 한번 말 해 주세요.');
            restartSpeech();
          }
        }, 500);

        let speechResult;

        recognition.current.start();

        recognition.current.onaudiostart = () => {
          console.log('audio start');

          gameSocket.sendGameStatus({
            roomId,
            script: '...인식중',
          });

          setScript('...인식중');
        };

        recognition.current.onstart = () => {
          console.warn('온스타트 됌');
        };

        recognition.current.onresult = ev => {
          speechResult = ev.results[0][0].transcript;

          gameSocket.sendGameStatus({
            roomId,
            script: speechResult,
          });

          setScript(speechResult);
        };

        recognition.current.onspeechend = () => {
          getSpeechResult(speechResult);
        };

        recognition.current.onaudioend = () => {
          console.log(' audio end ');
        };

        recognition.current.onend = () => {
          console.warn(' final end ');
        };

        recognition.current.onerror = ev => {
          setScript(ev.error);
          console.log('에러가 나서 재시작 함');
          getSpeechResult(speechResult);
        };
      };

      startRecongnition();
    }
  }, [gameData, isMyTurn]);

  const startGame = () => {
    gameSocket.startGame({ title: 'speechBomb', roomId });
  };

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {gameData ?
            <button disabled>게임 중 입니다.</button>
          :
            <button onClick={startGame}>시작</button>
        }
        <h1>{gameData && isMyTurn ? '내 차례..' : '내 차례 아님..'}</h1>
        <h1 style={{ color:'#292929'}} className='phrase'>{phrase}</h1>
        <div className='output'>
          <h3>{script}</h3>
        </div>
        <h3 style={{ fontSize:'30px'}}className='notification'>{notification}</h3>
      </div>
    </div>
  );
}

export default SpeechGame;

SpeechGame.propTypes = {
  roomId: PropTypes.string.isRequired,
  setMyTurn: PropTypes.func.isRequired,
  isMyTurn: PropTypes.bool,
};
