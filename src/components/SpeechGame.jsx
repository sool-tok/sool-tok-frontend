import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { gameSocket } from '../utils/socket';

function SpeechGame() {
  const [isDisabled, setDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('');
  const [notification, setNotification] = useState('');
  const [script, setScript] = useState('');
  const [phrase, setPhrase] = useState('');

  useEffect(() => {
    gameSocket.broadcastSpeechBomb({ phrase });
  }, [phrase]);

  useEffect(() => {
    gameSocket.broadcastSpeechBomb({ script });
  }, [script]);

  useEffect(() => {
    gameSocket.broadcastSpeechBomb({ notification });
  }, [notification]);

  useEffect(() => {
    gameSocket.listenPhrase(({ phrase, script, notification }) => {
      if(phrase) setPhrase(phrase);
      if(script) setScript(script);
      if(notification) setNotification(notification);
    });
  }, []);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

  const phrases = ['날씨가 너무 추워', '기분 좋아', '소켓 연결 했어'];

  const randomPhrase = () => {
    const number = Math.floor(Math.random() * phrases.length);
    return number;
  };

  const testSpeech = () => {
    const phrase = phrases[randomPhrase()];

    setDisabled(true);
    setPhrase(`${phrase}`);
    setResult('두구두구두구두구두구두구');

    const grammar = `#JSGF V1.0; grammar phrase; public <phrase> = ${phrase};`;
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    recognition.lang = 'ko';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    const restartSpeech = () => {
      recognition.stop();
      recognition.start();
    };

    const getSpeechResult = _.debounce((result = '') => {
      if (result.split(' ').join('') === phrase.split(' ').join('')) {
        setNotification('정답입니다.');
        setButtonText('다음 문제');
        setDisabled(false);
      } else {
        setNotification('다시 한번 말 해 주세요.');
        restartSpeech();
      }
    }, 500);

    recognition.start();

    recognition.onaudiostart = () => {
      console.log('audio start');
      setScript('...인식중');
    };

    recognition.onspeechstart = () => {
      console.log(' speech start ');
    };

    let speechResult;

    recognition.onresult = ev => {
      speechResult = ev.results[0][0].transcript;

      setScript(`${speechResult}`);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      getSpeechResult(speechResult);
    };

    recognition.onaudioend = () => {
      console.log(' audio end ');
    };

    recognition.onend = () => {
      console.log(' final end ');
    };

    recognition.onerror = ev => {
      setDisabled(true);
      setButtonText('error');
      setScript(`${ev.error}`);

      console.log('에러가 나서 재시작 함');
      getSpeechResult(speechResult);
    };
  };

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'column' }}>
      {isDisabled
        ? <button disabled>게임 중 입니다.</button>
        : <button onClick={testSpeech}>{buttonText || 'Start!!!!!'}</button>
      }
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
};
