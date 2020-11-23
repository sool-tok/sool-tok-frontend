import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { gameSocket, getMySocketId } from '../utils/socket';

function SpeechGame({
  roomId,
  isMyTurn,
  setMyTurn,
  setCurrentTurn,
  setFinalGame,
}) {
  const [gameData, setGameData] = useState(null);
  const gameDataRef = useRef();
  const isMyTurnRef = useRef();

  const timeout = useRef();
  const recognition = useRef();

  const [phrase, setPhrase] = useState('');
  const [notification, setNotification] = useState('');
  const [script, setScript] = useState('');

  const deleteReconginiton = () => {
    if (!recognition.current) return;
    recognition.current.stop();
    recognition.current = null;
  };

  const restartSpeech = () => {
    if (!recognition.current) return;
    recognition.current.stop();
    recognition.current.start();
  };

  const resetGame = () => {
    setPhrase('');
    setNotification('');
    setScript('');

    setCurrentTurn('');
    setGameData(null);
    setFinalGame(false);
    setMyTurn(false);

    clearTimeout(timeout.current);
    timeout.current = null;
    gameDataRef.current = null;
  };

  const startGame = () => {
    gameSocket.startGame({ title: 'speechBomb', roomId });
  };

  useEffect(() => {
    if (gameData) return;

    gameSocket.listenInitailizingGame(data => {
      const { initialTurn } = data;
      const mySocketId = getMySocketId();
      const isMyTurn = mySocketId === initialTurn;

      gameDataRef.current = data;
      isMyTurnRef.current = isMyTurn;

      setGameData(data);
      setMyTurn(isMyTurn);
      setCurrentTurn(initialTurn);
    });

    gameSocket.listenTurnChange(targetSocketId => {
      const mySocketId = getMySocketId();
      const isMyTurn = targetSocketId === mySocketId;

      isMyTurnRef.current = isMyTurn;

      setMyTurn(isMyTurn);
      setCurrentTurn(targetSocketId);
    });

    gameSocket.listenResetGame(resetGame);

    return () => resetGame();
  }, []);

  useEffect(() => {
    if (!gameData) return;

    if (!timeout.current) {
      timeout.current = setTimeout(() => {
        deleteReconginiton();

        if (isMyTurnRef.current) {
          console.log('게임 종료: 내가 걸렸다..');
          setNotification('내가 걸렸다..');
        } else {
          console.log('게임 종료: 난 걸리지 않았다..');
          setNotification('난 걸리지 않았다..');
        }

        setGameData(null);
        setScript('');
        setFinalGame(true);

        clearTimeout(timeout.current);
        timeout.current = null;
        gameDataRef.current = null;
      }, gameData.explosionTime);
    }
  }, [gameData, isMyTurn]);

  useEffect(() => {
    if (!gameData) return;
    if (!isMyTurn) {
      deleteReconginiton();

      gameSocket.listenProceedGame(data => {
        const { targetPhrase, notification, script } = data;
        if (notification) setNotification(notification);
        if (targetPhrase) setPhrase(targetPhrase);
        if (script) setScript(script);
      });
    } else {
      setScript('');
      setPhrase('');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

      const randomIndex = _.random(0, gameData.phrases.length - 1);
      const targetPhrase = gameData.phrases[randomIndex];

      gameSocket.sendGameStatus({
        roomId,
        targetPhrase,
        notification: '두구두구두구',
      });

      const startRecongnition = () => {
        setPhrase(targetPhrase);
        setNotification('두구두구두구');

        recognition.current = new SpeechRecognition();
        const speechRecognitionList = new SpeechGrammarList();
        const grammar = `#JSGF V1.0; grammar phrase; public <phrase> = ${phrase};`;
        let speechResult;

        speechRecognitionList.addFromString(grammar, 1);

        recognition.current.grammars = speechRecognitionList;
        recognition.current.lang = 'ko';
        recognition.current.interimResults = true;
        recognition.current.maxAlternatives = 1;

        const getSpeechResult = _.debounce((result = '') => {
          if (!gameDataRef.current) return;

          const isAnswer = result.split(' ').join('') === targetPhrase.split(' ').join('');

          if (isAnswer) {
            gameSocket.sendGameStatus({
              roomId,
              notification: '정답입니다.',
            });

            setNotification('정답입니다.');
            gameSocket.sendNextTurn({ roomId });
          } else {
            console.warn('Result: 실패');
            setNotification('다시 한번 말 해보세요.');
            restartSpeech();
          }
        }, 500);

        recognition.current.start();

        recognition.current.onaudiostart = () => {
          if (!recognition.current) return;

          gameSocket.sendGameStatus({
            roomId,
            script: '...인식중',
          });

          setScript('...인식중');
        };

        recognition.current.onresult = ev => {
          speechResult = ev.results[0][0].transcript;

          gameSocket.sendGameStatus({
            roomId,
            script: speechResult,
          });

          setScript(speechResult);
        };

        recognition.current.onend = () => {
          getSpeechResult(speechResult);
        };

        recognition.current.onerror = ev => {
          console.error('error', ev.error);
          deleteReconginiton();
          gameSocket.sendResetGame(roomId);
        };
      };

      startRecongnition();
    }
  }, [gameData, isMyTurn]);

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {
          gameData ?
            <button disabled>게임 중 입니다.</button>
          :
            <button onClick={startGame}>시작</button>
        }
        <h1>{gameData && (isMyTurn ? '내 차례..' : '내 차례 아님..')}</h1>
        <h1 style={{ color:'#292929'}} className='phrase'>{phrase}</h1>
        <div className='output'>
          <h3>{script}</h3>
        </div>
        <h3 style={{ fontSize:'30px'}} className='notification'>{notification}</h3>
      </div>
    </div>
  );
}

export default SpeechGame;

SpeechGame.propTypes = {
  roomId: PropTypes.string.isRequired,
  setMyTurn: PropTypes.func.isRequired,
  isMyTurn: PropTypes.bool.isRequired,
  currentTurn: PropTypes.string.isRequired,
  setCurrentTurn: PropTypes.func.isRequired,
  setFinalGame: PropTypes.func.isRequired,
};
